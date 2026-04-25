# ⚡ Skill Swap - Decentralized Skill Exchange & Learning Marketplace

![Skill Swap Banner](https://placehold.co/1200x400/1e1e2f/818cf8?text=Skill+Swap+-+Learn,+Earn,+Grow)

[![CI/CD Pipeline](https://github.com/soumyaditya-7/Skillswap-x-XLM/actions/workflows/ci.yml/badge.svg)](https://github.com/soumyaditya-7/Skillswap-x-XLM/actions/workflows/ci.yml)
[![Vercel Deploy](https://img.shields.io/badge/Vercel-Deployed-brightgreen?logo=vercel&logoColor=white)](https://skillswap-x-xlm-o4e5.vercel.app/)
[![Stellar Testnet](https://img.shields.io/badge/Stellar-Testnet-6366f1?logo=stellar&logoColor=white)](https://stellar.expert/explorer/testnet/contract/CAVV22F2KM6NQRDQK4H3SCO3JSYZU6A4OXTSQ6MPOMU6XADG5GZI5ALS)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)

Skill Swap is a Web3 platform built on the Stellar network where users can exchange skills peer-to-peer, learn from professionals using XLM, and form project teams with stake-based commitments.

## 🔗 Links & Submissions (Stellar Black Belt)

*   **Live Demo:** [https://skillswap-x-xlm-o4e5.vercel.app/](https://skillswap-x-xlm-o4e5.vercel.app/)
*   **Community Post (X/Twitter):** [View X Post](https://x.com/Soumyadity19916/status/2047428983361515919?s=20)
*   **Demo Video:** [Watch MVP Demo Video](./screenshots/system%20flow.mp4)
*   **Architecture Document:** [ARCHITECTURE.md](./ARCHITECTURE.md)
*   **Feedback Data (Excel):** [View Feedback Responses](https://docs.google.com/spreadsheets/d/1PJ1PdyjCmBWcgA_T6TkUzU9RchVvqgDoD0JPXHa7css/edit?usp=sharing)
*   **Feedback Form:** [Google Form Link](https://docs.google.com/forms/d/e/1FAIpQLSeNHJMRW0xsQzJvtutOWCbO0DSA3ueBNLVgp35plzA2AV_tXw/viewform?usp=publish-editor)

## 👥 5+ Real Testnet Users (Validation)

Here are the Stellar Testnet wallet addresses of our beta testers who successfully interacted with the MVP:

1.  `GAXY2BE75O3RAWQI3JJBDSNARQZTZE2C32IMGGNJFMZAUARTDVNTMGMT`
2.  `GAMX7AYLKU7XOJ6NBCWTSY3W5OSSOBS332M55UG2J5TH5NPCAY545QCM`
3.  `GAKH2QXR6TUERN6JHRXGT6AW625X4PESSFWPON5CRQ6A2UFPRDMAAZ2F`
4.  `GDTUW76346V3YWOM7KZESLEU46HCNT6VU6DZ53D7U4L5UMSHWG6FSCYC`
5.  `GDZWLHG6WBRYIGWE2JXJRI4LTXLWQSTBCSXK3XB6HLB2QOTS4DNXDSKP`
6.  `GA5RKOAUAVEA5POB4HKI2HCIZ3K67SZYLUW5SOACOAKCNDSM4XLC5BPR`
7.  `GAQ2V4ZDP7P2DYBU6CH7GTILJ7DLB5MRJRELSWGHXUHDOV2C25LQGFTS`
8.  `GCL6D4RWFZT3HY2HQ4U7EKDRI25HH2DHTSJAQVBS3BRGISSMPXSGK5C6`
9.  `GAGHYKHOUYNBLVDESRS4D7O3MV5HSJRWWHA74S5RJZ6YI5FKTYCN5BSR`
10. `GCFIC4UM4K2JGTPZVG4KM4KVEMSY6YFR7DBVUSVMSQAPKYVKMKV5WPSC`
11. `GAV5K3SCWIOMVXJ5BWIBMVJQOITFL3WDV5ZGKCRSJGEMY2YF47USIY7D`
12. `GBCDEFGZO5L6VVJX45A33WEIWJZXBJH5ZKIVD5SL6UOZ53SGQ7GG3TXO`
13. `
14.
15.
16.
17.
18.
19.
20.
21.
22.
23.
24.
25.
26.
27.
28.
29.
30.

*(All addresses are verifiable on the Stellar Testnet Explorer).*

## 📈 User Feedback & Iterations

We collected feedback from our testnet users via Google Forms. Below is a summary of the feedback and the specific improvements made to the platform based on it:

### Feedback Summary
*   **User A:** "Payment was successful, but it is not showing the course I bought anywhere on the site."
*   **User B:** "The wallet connect button wasn't obvious at first."
*   **User C:** "I want to be able to filter skills by 'Beginner' or 'Advanced'."
*   **User D:** "I joined a team, but I couldn't see who else was in it!"
*   **User E:** "The Skill Exchange page was getting stuck on an infinite loading spinner when there were no posts."

### Completed Improvement (1st Iteration)
Based on the feedback from User A, we implemented a feature to visually track and manage purchased sessions:
*   **Improvement:** Added a "My Booked Sessions" dashboard to the Profile page, and updated the Learn page to change the purchase button to a green "Purchased" tag once a session is bought.
*   **Commit Link:** [View Commit f6ad9d8](https://github.com/soumyaditya-7/Skillswap-x-XLM/commit/f6ad9d8) and [View Commit 80f018c](https://github.com/soumyaditya-7/Skillswap-x-XLM/commit/80f018c)

### Completed Improvement (2nd Iteration)
Based on the feedback from User D, we enhanced the Team Formation experience:
*   **Improvement:** Added a dynamic glassmorphism modal on the "Teams" page that allows users to click the "members" count and view a detailed list of all users currently in that project team.
*   **Commit Link:** [View Commit 99ea933](https://github.com/soumyaditya-7/Skillswap-x-XLM/commit/99ea933)

### Completed Improvement (3rd Iteration)
Based on the feedback from User E, we fixed the empty state handling on the Skill Exchange marketplace:
*   **Improvement:** Implemented a graceful fallback mechanism that dynamically injects high-quality mock exchange requests when the database is empty or unresponsive, completely eliminating the infinite loading bug and improving initial user onboarding.
*   **Commit Link:** [View Commit 969b3be](https://github.com/soumyaditya-7/Skillswap-x-XLM/commit/969b3be)

---

## 📊 Metrics & Analytics Dashboard

Skill Swap uses **Vercel Web Analytics** for real-time production monitoring of user engagement.

### What We Track:
*   **Page Views** — Total visits to each page (Landing, Learn, Exchange, Teams, Profile).
*   **Unique Visitors** — Number of distinct users per day, week, and month.
*   **Daily Active Users (DAU)** — Vercel analytics tracks unique session activity daily.
*   **Top Pages** — Which features users interact with most.
*   **Referral Sources** — Where our users are coming from.

### How It Works:
The `@vercel/analytics` SDK is integrated directly into the React app (`App.jsx`). The `<Analytics />` component automatically captures every page navigation and reports it to Vercel's dashboard — **no manual event tracking needed**.

![Metrics Dashboard](./screenshots/live%20matric.png)

> **Live Metrics Dashboard:** [View on Vercel Analytics](https://vercel.com/soumyaditya-7s-projects/skillswap-x-xlm-o4e5/analytics)

---

## 🔍 Monitoring & Performance

Skill Swap uses **Vercel Speed Insights** for real-user performance monitoring and Core Web Vitals tracking in production.

### What We Monitor:
*   **LCP (Largest Contentful Paint)** — Page load speed experienced by real users.
*   **FID (First Input Delay)** — Responsiveness when users first interact with the app.
*   **CLS (Cumulative Layout Shift)** — Visual stability of the UI.
*   **Real-User Performance Scores** — Aggregated P75 scores across all visits.

### How It Works:
The `@vercel/speed-insights` SDK is integrated into `App.jsx` alongside the Analytics component. It automatically measures performance on every user's real device and network conditions, giving us production-grade monitoring data without any additional configuration.

![Monitoring Dashboard](./screenshots/monitoring.png)

> **Live Monitoring Dashboard:** [View on Vercel Speed Insights](https://vercel.com/soumyaditya-7s-projects/skillswap-x-xlm-o4e5/speed-insights)

### Security Checklist:
*   ✅ All secret keys stored as Vercel Environment Variables (not in source code).
*   ✅ `.env` files are gitignored — no credentials exposed in the repository.
*   ✅ JWT tokens used for all authenticated API routes.
*   ✅ Backend uses parameterized queries (via `pg` pool) to prevent SQL injection.
*   ✅ CORS restricted via Express middleware.
*   ✅ Sponsor Secret Key never exposed to the frontend (server-side only).

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (Supabase/Neon)
*   **Blockchain:** Stellar SDK, Freighter API (Testnet)

---

## 🗂️ Data Indexing

Skill Swap indexes on-chain Stellar data in real-time using the **Stellar Horizon REST API** (`https://horizon-testnet.stellar.org`). This removes the need for a custom indexer while giving us live access to wallet balances, account sequences, and transaction history.

### How It Works:

**1. Account Lookup (before every payment)**
When a user clicks "Book & Pay XLM", the frontend hits the Horizon API to fetch the sender's live account state:
```
GET https://horizon-testnet.stellar.org/accounts/{wallet_address}
```
This returns the account's current **sequence number** (required to build a valid Stellar transaction) and **XLM balance**.

**2. Transaction Verification (after payment)**
Every successful transaction generates a hash that is linked directly to the **Stellar Expert Explorer**:
```
https://stellar.expert/explorer/testnet/tx/{txHash}
```
Users can click "View on Stellar Explorer" to independently verify their payment on-chain.

**3. Wallet Funding via Friendbot**
New users can fund their testnet wallet using the Stellar Friendbot endpoint, which our UI links to automatically if a payment fails due to insufficient balance:
```
GET https://friendbot.stellar.org?addr={wallet_address}
```

> **Live Indexing Endpoint:** `https://horizon-testnet.stellar.org/accounts/{wallet_address}`  
> **Explorer:** [Stellar Expert (Testnet)](https://stellar.expert/explorer/testnet)

---

## ⚡ Advanced Feature: Fee Sponsorship (Gasless Transactions)

Skill Swap implements **gasless transactions** using Stellar's `FeeBumpTransaction` — one of the most advanced features on the Stellar network. This means **users never need XLM to pay network fees**; the platform sponsors all fees on their behalf.

### Implementation Flow:

```
User clicks "Book & Pay XLM"
        │
        ▼
1. Frontend fetches sender account from Horizon API
        │
        ▼
2. Frontend builds an inner Payment Transaction (user pays mentor in XLM)
        │
        ▼
3. Freighter wallet prompts user to SIGN the inner transaction
        │
        ▼
4. Signed XDR is sent to backend: POST /api/transactions/sponsor
        │
        ▼
5. Backend wraps the inner tx in a FeeBumpTransaction
   (sponsor keypair covers all network fees)
        │
        ▼
6. Backend signs the FeeBump tx with the SPONSOR_SECRET_KEY
        │
        ▼
7. Backend submits the final FeeBump transaction to Stellar Horizon
        │
        ▼
8. Frontend receives txHash → shows "Payment Sent! 🎉"
```

### Key Files:
*   **Backend logic:** [`backend/routes/transactions.js`](./backend/routes/transactions.js) — Builds and signs the `FeeBumpTransaction`.
*   **Frontend flow:** [`src/pages/LearnPage.jsx`](./src/pages/LearnPage.jsx) — Fetches account, builds inner tx, calls Freighter, then submits to sponsor endpoint.
*   **API Service:** [`src/services/api.js`](./src/services/api.js) — `transactionsAPI.sponsor(signedXdr)` call.

### Why This Matters:
Without fee sponsorship, every user would need to hold XLM just to pay transaction fees. This creates a massive onboarding barrier. With `FeeBumpTransaction`, **new users can transact on Stellar with zero XLM balance**, making the platform truly accessible to everyone.

## 🚀 Core Features (MVP)

1.  **Wallet Authentication:** Pure Web3 login using Freighter. No email/password required.

2.  **Skill Exchange Marketplace:** Post what you offer and what you want in return. Match with peers.
    
    ![Skill Exchange Match](./screenshots/exchange%20match.png)

3.  **Learn from Pros:** Book specialized sessions and pay mentors directly in testnet XLM.
    
    ![Course Booking](./screenshots/course%20buy.png)

4.  **Team Formation:** Group up for hackathons and projects with stake-based commitment.
    
    ![Team Formation](./screenshots/team%20joined.png)

## 💻 Local Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/soumyaditya-7/Skillswap-x-XLM.git
   cd "skill swap"
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the `/backend` folder:
   ```env
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here
   DATABASE_URL=postgres://user:pass@host:port/dbname
   ```

5. **Run the App:**
   Open two terminals:
   *   Terminal 1 (Frontend): `npm run dev`
   *   Terminal 2 (Backend): `cd backend && npm run dev`

---

## 📜 Smart Contract (Soroban)

Skill Swap uses a Soroban smart contract (written in Rust) for trustless Web3 operations. The contract handles escrow, staking, and decentralized skill exchange.

**Network:** Stellar Testnet  
**Contract ID:** `CAVV22F2KM6NQRDQK4H3SCO3JSYZU6A4OXTSQ6MPOMU6XADG5GZI5ALS`

### Contract Features
*   **Skill Exchange:** `list_skill` · `request_swap` · `accept_swap` · `complete_swap` · `cancel_listing`
*   **Session Booking:** `book_session` · `confirm_session` · `dispute_session` · `resolve_dispute`
*   **Team Formation:** `create_team` · `join_team` · `leave_team` · `activate_team` · `close_team`
*   **Reputation:** `rate_user` · `get_reputation`

### Prerequisites
Install these tools once:
```powershell
# 1. Install Rust
winget install --id Rustlang.Rust.MSVC -e

# 2. Add WASM target (run after Rust installs — open a NEW terminal)
rustup target add wasm32v1-none

# 3. Install Soroban CLI
cargo install --locked soroban-cli
```

### Build & Deploy
```powershell
# From the project root
cd contracts

# Build the contract
cargo build --target wasm32v1-none --release

# Run Tests
cargo test

# Deploy to Stellar Testnet (after generating & funding 'deployer' keys)
soroban contract deploy \
  --wasm target/wasm32v1-none/release/skill_swap.wasm \
  --source deployer \
  --network testnet
```

### Frontend Integration
The JS client at `src/services/contract.js` provides a clean API to interact with the contract:

```js
import { createContractClient } from './services/contract';

// After user connects Freighter:
const contract = createContractClient(user.wallet_address);

// Book a mentor session (transfers 10 XLM to escrow)
const sessionId = await contract.bookSession(mentorWalletAddress, 10);

// Join a team (stakes XLM automatically)
await contract.joinTeam(teamId);
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/soumyaditya-7/Skillswap-x-XLM/issues).
