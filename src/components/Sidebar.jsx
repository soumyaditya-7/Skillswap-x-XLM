import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Home, Zap, Users, BookOpen, Wallet, User, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: Home, label: 'Home', path: '/dashboard' },
  { icon: Zap, label: 'Skill Exchange', path: '/exchange' },
  { icon: BookOpen, label: 'Find Mentors', path: '/learn' },
  { icon: Users, label: 'Teams', path: '/teams' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ user, onLogout }) => {
  return (
    <aside className="w-64 h-screen border-r border-border bg-background fixed left-0 top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="text-xl font-bold font-outfit text-foreground tracking-tight flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
            <Zap size={14} className="text-white" fill="currentColor" />
          </div>
          SkillSwap
        </span>
      </div>

      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-secondary text-foreground" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center">
            <User size={16} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{user?.username || 'Guest'}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.stellar_public_key ? `${user.stellar_public_key.slice(0,6)}...${user.stellar_public_key.slice(-4)}` : 'Not connected'}</p>
          </div>
        </div>
        
        {onLogout && (
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <LogOut size={18} />
            Log out
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
