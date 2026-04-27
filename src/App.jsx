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
import NoiseOverlay      from './components/NoiseOverlay';
import Sidebar           from './components/Sidebar';
import { getToken, clearToken, usersAPI } from './services/api';
import { useLocation } from 'react-router-dom';

const AppContent = () => {
  const [user,      setUser]      = useState(null);
  const [showAuth,  setShowAuth]  = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = getToken();
    if (token) {
      usersAPI.getMe()
        .then(data => setUser(data))
        .catch(() => clearToken())
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

  if (!authReady) return null;

  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <>
      <NoiseOverlay />
      
      {/* Conditionally render Navbar/Footer based on route */}
      {!isDashboard && (
        <Navbar
          user={user}
          onConnectClick={() => setShowAuth(true)}
          onLogout={handleLogout}
        />
      )}

      {isDashboard && (
        <Sidebar user={user} onLogout={handleLogout} />
      )}

      {showAuth && (
        <AuthModal
          onClose={() => setShowAuth(false)}
          onSuccess={handleAuthSuccess}
        />
      )}

      <div className={isDashboard ? "ml-64 min-h-screen bg-background" : ""}>
        <Routes>
          <Route path="/"          element={<LandingPage onConnectClick={() => setShowAuth(true)} />} />
          <Route path="/dashboard" element={
            user ? <DashboardPage user={user} /> : <Navigate to="/" replace />
          } />
          <Route path="/exchange"  element={<SkillExchangePage user={user} onConnectClick={() => setShowAuth(true)} />} />
          <Route path="/learn"     element={<LearnPage user={user} onConnectClick={() => setShowAuth(true)} />} />
          <Route path="/teams"     element={<TeamFormationPage user={user} onConnectClick={() => setShowAuth(true)} />} />
          <Route path="/profile"   element={<ProfilePage user={user} onConnectClick={() => setShowAuth(true)} />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isDashboard && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
};

export default App;
