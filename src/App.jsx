import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar          from './components/Navbar';
import LandingPage     from './pages/LandingPage';
import DashboardPage   from './pages/DashboardPage';
import SkillExchangePage from './pages/SkillExchangePage';
import LearnPage       from './pages/LearnPage';
import TeamFormationPage from './pages/TeamFormationPage';
import ProfilePage     from './pages/ProfilePage';

const App = () => {
  const [wallet, setWallet] = useState(null);

  return (
    <BrowserRouter>
      <Navbar wallet={wallet} setWallet={setWallet} />
      <Routes>
        {/* Public landing */}
        <Route path="/"          element={<LandingPage setWallet={setWallet} />} />

        {/* Post-connect dashboard */}
        <Route path="/dashboard" element={
          wallet ? <DashboardPage wallet={wallet} /> : <Navigate to="/" replace />
        } />

        {/* Feature pages — accessible to all (show connect prompt when needed) */}
        <Route path="/exchange"  element={<SkillExchangePage wallet={wallet} />} />
        <Route path="/learn"     element={<LearnPage wallet={wallet} />} />
        <Route path="/teams"     element={<TeamFormationPage wallet={wallet} />} />
        <Route path="/profile"   element={<ProfilePage wallet={wallet} />} />

        {/* Fallback */}
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
