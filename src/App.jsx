import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar            from './components/Navbar';
import AuthModal         from './components/AuthModal';
import LandingPage       from './pages/LandingPage';
import DashboardPage     from './pages/DashboardPage';
import SkillExchangePage from './pages/SkillExchangePage';
import LearnPage         from './pages/LearnPage';
import TeamFormationPage from './pages/TeamFormationPage';
import ProfilePage       from './pages/ProfilePage';
import Footer            from './components/Footer';
import { getToken, clearToken, usersAPI } from './services/api';

const App = () => {
  const [user,      setUser]      = useState(null);   // full user object from API
  const [showAuth,  setShowAuth]  = useState(false);  // open/close AuthModal
  const [authReady, setAuthReady] = useState(false);  // prevent flicker on load

  // ── Re-hydrate session from localStorage token ─────────────
  useEffect(() => {
    const token = getToken();
    if (token) {
      usersAPI.getMe()
        .then(data => setUser(data))
        .catch(() => clearToken())          // expired / invalid → clear
        .finally(() => setAuthReady(true));
    } else {
      setAuthReady(true);
    }
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowAuth(false);
  };

  const handleLogout = () => {
    clearToken();
    setUser(null);
  };

  // Don't render routes until we've checked token (avoids flash)
  if (!authReady) return null;

  return (
    <BrowserRouter>
      {/* Navbar always visible */}
      <Navbar
        user={user}
        onConnectClick={() => setShowAuth(true)}
        onLogout={handleLogout}
      />

      {/* Auth Modal (portal-style overlay) */}
      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <Routes>
        {/* Public landing */}
        <Route path="/"          element={<LandingPage onConnectClick={() => setShowAuth(true)} />} />

        {/* Protected dashboard — redirect to landing if not logged in */}
        <Route path="/dashboard" element={
          user ? <DashboardPage user={user} /> : <Navigate to="/" replace />
        } />

        {/* Feature pages — accessible to all */}
        <Route path="/exchange"  element={<SkillExchangePage user={user} onConnectClick={() => setShowAuth(true)} />} />
        <Route path="/learn"     element={<LearnPage user={user} onConnectClick={() => setShowAuth(true)} />} />
        <Route path="/teams"     element={<TeamFormationPage user={user} onConnectClick={() => setShowAuth(true)} />} />
        <Route path="/profile"   element={<ProfilePage user={user} onConnectClick={() => setShowAuth(true)} />} />

        {/* Fallback */}
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>

      <Footer />

      {/* Vercel Web Analytics - tracks page views & DAU automatically */}
      <Analytics />

      {/* Vercel Speed Insights - tracks Core Web Vitals & performance */}
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
