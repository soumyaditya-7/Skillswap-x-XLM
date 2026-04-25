import React from 'react';
import { Shield, Users, Activity, ExternalLink, Mail, User } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full bg-[#352f5b] border-t border-white/5 pt-16 pb-8 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Top Section: Trust Indicators */}
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-sm">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-brand-300" />
            <div>
              <p className="font-semibold text-white">Community</p>
              <p className="text-slate-400">Trust Circles</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/10" />
          
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-brand-300" />
            <div>
              <p className="font-semibold text-white">Blockchain</p>
              <p className="text-slate-400">Transparency</p>
            </div>
          </div>
          <div className="hidden sm:block w-px h-8 bg-white/10" />
          
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-brand-300" />
            <div>
              <p className="font-semibold text-white">Security</p>
              <p className="text-slate-400">& Reliability</p>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Middle Section: Links & Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-brand-500/20">
                <span className="text-xl">⚡</span>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Skill Swap</span>
            </div>
            <a 
              href="#about" 
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-brand-200 transition-colors w-fit border border-white/10"
            >
              <span className="text-sm font-medium">About Us</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-lg mb-2">Platform</h4>
            <a href="/dashboard" className="text-slate-400 hover:text-brand-300 transition-colors">Dashboard</a>
            <a href="/exchange" className="text-slate-400 hover:text-brand-300 transition-colors">Skill Exchange</a>
            <a href="/learn" className="text-slate-400 hover:text-brand-300 transition-colors">Learn from Pros</a>
            <a href="/teams" className="text-slate-400 hover:text-brand-300 transition-colors">Team Formation</a>
          </div>

          {/* Contact / Founder */}
          <div className="flex flex-col gap-4">
            <h4 className="text-white font-semibold text-lg mb-2">Contact & Founder</h4>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <User className="w-4 h-4 text-brand-300" />
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">Founder</p>
                <p className="text-white">Soumyaditya Debnath</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                <Mail className="w-4 h-4 text-brand-300" />
              </div>
              <a href="mailto:soumyadityadebnath997@gmail.com" className="hover:text-brand-300 transition-colors">
                soumyadityadebnath997@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Section: Copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Skill Swap Protocol Foundation. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> Secure</span>
            <span className="flex items-center gap-1.5"><Activity className="w-4 h-4" /> Decentralized</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
