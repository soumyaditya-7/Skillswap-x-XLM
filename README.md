# ⚡ Skill Swap - Decentralized Skill Exchange & Learning Marketplace

![Skill Swap Banner](https://placehold.co/1200x400/1e1e2f/818cf8?text=Skill+Swap+-+Learn,+Earn,+Grow)

Skill Swap is a Web3 platform built on the Stellar network where users can exchange skills peer-to-peer, learn from professionals using XLM, and form project teams with stake-based commitments.

## 🔗 Links & Submissions (Stellar Blue Belt)

*   **Live Demo:** [https://skillswap-x-xlm-o4e5.vercel.app/](https://skillswap-x-xlm-o4e5.vercel.app/)
*   **Demo Video:** [Insert YouTube/Loom Link Here]
*   **Architecture Document:** [ARCHITECTURE.md](./ARCHITECTURE.md)
*   **Feedback Data (Excel):** [Link to Google Sheets/Excel Here]
*   **Feedback Form:** [Link to Google Form Here]

## 👥 5+ Real Testnet Users (Validation)

Here are the Stellar Testnet wallet addresses of our beta testers who successfully interacted with the MVP:

1.  `GAXY2BE75O3RAWQI3JJBDSNARQZTZE2C32IMGGNJFMZAUARTDVNTMGMT`
2.  `GAMX7AYLKU7XOJ6NBCWTSY3W5OSSOBS332M55UG2J5TH5NPCAY545QCM`
3.  `GAKH2QXR6TUERN6JHRXGT6AW625X4PESSFWPON5CRQ6A2UFPRDMAAZ2F`
4.  `GDTUW76346V3YWOM7KZESLEU46HCNT6VU6DZ53D7U4L5UMSHWG6FSCYC`
5.  `[Wallet Address 5]`

*(All addresses are verifiable on the Stellar Testnet Explorer).*

## 📈 User Feedback & Iterations

We collected feedback from our testnet users via Google Forms. Below is a summary of the feedback and the specific improvements made to the platform based on it:

### Feedback Summary
*   **User A:** "The wallet connect button wasn't obvious at first."
*   **User B:** "I want to be able to filter skills by 'Beginner' or 'Advanced'."
*   *... [Add actual feedback summary here]*

### Completed Improvement (1st Iteration)
Based on the feedback, we implemented the following feature:
*   **Improvement:** [Describe what you built/fixed, e.g., "Added a clear error message when the backend is unreachable during wallet connection."]
*   **Commit Link:** [Insert Git Commit URL Here, e.g., `https://github.com/soumyaditya-7/Skillswap-x-XLM/commit/abcdef123456`]

---

## 🛠️ Tech Stack

*   **Frontend:** React 19, Vite, Tailwind CSS, Framer Motion
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (Supabase/Neon)
*   **Blockchain:** Stellar SDK, Freighter API (Testnet)

## 🚀 Core Features (MVP)

1.  **Wallet Authentication:** Pure Web3 login using Freighter. No email/password required.
2.  **Skill Exchange Marketplace:** Post what you offer and what you want in return. Match with peers.
3.  **Learn from Pros:** Book specialized sessions and pay mentors directly in testnet XLM.
4.  **Team Formation:** Group up for hackathons and projects with stake-based commitment.

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

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/soumyaditya-7/Skillswap-x-XLM/issues).
