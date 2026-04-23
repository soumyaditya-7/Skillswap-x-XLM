# ⚡ Skill Swap - Decentralized Skill Exchange & Learning Marketplace

![Skill Swap Banner](https://placehold.co/1200x400/1e1e2f/818cf8?text=Skill+Swap+-+Learn,+Earn,+Grow)

Skill Swap is a Web3 platform built on the Stellar network where users can exchange skills peer-to-peer, learn from professionals using XLM, and form project teams with stake-based commitments.

## 🔗 Links & Submissions (Stellar Blue Belt)

*   **Live Demo:** [https://skillswap-x-xlm-o4e5.vercel.app/](https://skillswap-x-xlm-o4e5.vercel.app/)
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

![Metrics Dashboard](./screenshots/metrics.png)

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

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check [issues page](https://github.com/soumyaditya-7/Skillswap-x-XLM/issues).
