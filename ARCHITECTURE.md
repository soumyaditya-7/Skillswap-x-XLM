# Skill Swap Architecture

This document describes the high-level architecture of the **Skill Swap** application.

## 1. System Overview

Skill Swap is a modern Web3 application designed to facilitate decentralized skill exchange, learning, and team formation. The system combines a traditional Web2 tech stack with Web3 components to provide a seamless user experience while leveraging the Stellar network for payments and authentication.

### Key Components:
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Blockchain**: Stellar Network (Testnet), Freighter Wallet

---

## 2. Architecture Diagram

```mermaid
graph TD
    %% Frontend Layer
    subgraph Frontend [Client Browser - React/Vite]
        UI[User Interface]
        State[React State / Context]
        AuthMod[Auth Modal]
        StellarAPI[Stellar / Freighter API]
    end

    %% Freighter Extension
    subgraph Extension [Browser Extension]
        Freighter[Freighter Wallet]
    end

    %% Backend Layer
    subgraph Backend [Node.js / Express Server]
        API[REST API Routes]
        AuthCtrl[Auth Controller]
        UserCtrl[User Controller]
        ExCtrl[Exchange Controller]
        DBClient[pg Pool]
    end

    %% Database Layer
    subgraph Database [PostgreSQL Cloud]
        UsersDB[(Users)]
        SkillsDB[(Skills)]
        ExchangesDB[(Exchanges)]
        RatingsDB[(Ratings)]
    end

    %% Blockchain Layer
    subgraph Blockchain [Stellar Network]
        Horizon[Stellar Horizon API (Testnet)]
    end

    %% Connections
    UI <--> State
    State <--> API
    UI --> AuthMod
    AuthMod <--> Freighter : "1. Request Access"
    AuthMod --> API : "2. Send Public Key"
    API --> AuthCtrl
    AuthCtrl <--> DBClient : "3. Get/Create User"
    AuthCtrl --> AuthMod : "4. Return JWT"
    
    API --> UserCtrl
    API --> ExCtrl
    UserCtrl <--> DBClient
    ExCtrl <--> DBClient
    
    DBClient <--> UsersDB
    DBClient <--> SkillsDB
    DBClient <--> ExchangesDB
    DBClient <--> RatingsDB

    %% Payment Flow
    UI --> StellarAPI : "Initiate Payment"
    StellarAPI --> Horizon : "Fetch Sequence"
    StellarAPI --> Freighter : "Sign Transaction"
    StellarAPI --> Horizon : "Submit Transaction"
```

---

## 3. Data Flow & Communication

### 3.1 Authentication Flow
Skill Swap uses a password-less authentication system powered by the Freighter wallet.
1. The user clicks "Connect Wallet" on the frontend.
2. The application requests access to the user's Freighter wallet using `@stellar/freighter-api`.
3. Freighter prompts the user to grant access and returns the user's public key (wallet address).
4. The frontend sends this public key to the backend (`POST /api/auth/wallet`).
5. The backend checks if the user exists in the PostgreSQL database. If not, a new user account is automatically created.
6. The backend generates a JWT token and sends it back to the client.
7. Subsequent API requests from the frontend include this JWT in the Authorization header.

### 3.2 Real XLM Payments (LearnPage)
When a user books a session with a professional mentor:
1. The frontend queries the Stellar Testnet Horizon API to load the sender's account details and sequence number.
2. The frontend uses `@stellar/stellar-sdk` to build a `Payment` operation transferring testnet XLM from the user's wallet to the mentor's wallet.
3. The transaction XDR is passed to Freighter to prompt the user for their signature.
4. Once signed, the frontend submits the signed XDR directly to the Stellar Horizon API.
5. A successful response includes the transaction hash, which is displayed to the user with a link to the Stellar Expert explorer.

### 3.3 Database Operations
The backend uses the `pg` library to maintain a connection pool to a Supabase PostgreSQL instance. Relational tables track users, their offered/desired skills, open exchange listings, match requests, and user ratings.

---

## 4. Deployment Strategy

- **Frontend**: Deployed as a static SPA (Single Page Application) using Vercel.
- **Backend**: Hosted on Vercel using Serverless Functions (via `vercel.json` configuration).
- **Database**: Hosted on Supabase (Serverless PostgreSQL).
