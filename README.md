# ⚡ Skill Swap - Decentralized Skill Exchange & Learning Marketplace

![Skill Swap Banner](https://placehold.co/1200x400/1e1e2f/818cf8?text=Skill+Swap+-+Learn,+Earn,+Grow)

Skill Swap is a Web3 platform built on the Stellar network where users can exchange skills peer-to-peer, learn from professionals using XLM, and form project teams with stake-based commitments.

## 🔗 Links & Submissions (Stellar Blue Belt)

*   **Live Demo:** [https://skillswap-x-xlm-o4e5.vercel.app/](https://skillswap-x-xlm-o4e5.vercel.app/)
*   **Demo Video:** [Insert YouTube/Loom Link Here]
*   **Architecture Document:** [ARCHITECTURE.md](./ARCHITECTURE.md)
*   **Feedback Data (Excel):** [View Feedback Responses](https://docs.google.com/spreadsheets/d/1PJ1PdyjCmBWcgA_T6TkUzU9RchVvqgDoD0JPXHa7css/edit?usp=sharing)
*   **Feedback Form:** [Google Form Link](https://docs.google.com/forms/d/e/1FAIpQLSeNHJMRW0xsQzJvtutOWCbO0DSA3ueBNLVgp35plzA2AV_tXw/viewform?usp=publish-editor)

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
*   **User A:** "Payment was successful, but it is not showing the course I bought anywhere on the site."
*   **User B:** "The wallet connect button wasn't obvious at first."
*   **User C:** "I want to be able to filter skills by 'Beginner' or 'Advanced'."

### Completed Improvement (1st Iteration)
Based on the feedback from User A, we implemented a feature to visually track and manage purchased sessions:
*   **Improvement:** Added a "My Booked Sessions" dashboard to the Profile page, and updated the Learn page to change the purchase button to a green "Purchased" tag once a session is bought.
*   **Commit Link:** [View Commit f6ad9d8](https://github.com/soumyaditya-7/Skillswap-x-XLM/commit/f6ad9d8) and [View Commit 80f018c](https://github.com/soumyaditya-7/Skillswap-x-XLM/commit/80f018c)

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
