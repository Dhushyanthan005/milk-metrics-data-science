import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { FiTrendingUp, FiDatabase, FiBarChart2, FiActivity, FiMenu, FiX, FiInfo, FiFileText, FiSettings } from 'react-icons/fi';
import { GiCow } from 'react-icons/gi';

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load saved theme and accent colors on mount
  useEffect(() => {
    // 1. Light/dark mode loading
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }

    // 2. Accent color loading
    const savedColor = localStorage.getItem('theme-color') || 'emerald';
    const colors = ['emerald', 'cyan', 'indigo', 'amber', 'rose'];
    colors.forEach(c => document.documentElement.classList.remove(`theme-${c}`));
    document.documentElement.classList.add(`theme-${savedColor}`);
  }, []);

  const navigation = [
    { name: 'Dashboard', to: '/', icon: FiTrendingUp },
    { name: 'Predict Yield', to: '/predict', icon: FiActivity },
    { name: 'Analytics Hub', to: '/analytics', icon: FiBarChart2 },
    { name: 'Feature Insights', to: '/insights', icon: FiInfo },
    { name: 'Prediction History', to: '/history', icon: FiDatabase },
    { name: 'Farm Reports', to: '/reports', icon: FiFileText },
    { name: 'Settings', to: '/settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 flex flex-col">
      
      {/* Top Banner Info Bar */}
      <div className="bg-[var(--color-brand-primary)] text-white text-[11px] font-medium py-2 px-4 sm:px-6 lg:px-8 hidden md:flex items-center justify-between border-b border-white/10 shadow-sm transition-all duration-300">
        <div className="flex items-center gap-4 flex-wrap">
          <span>+91 76958 18365</span>
          <span className="text-white/40">|</span>
          <span>duskydon004@gmail.com</span>
          <span className="text-white/40">|</span>
          <span>Tirunelveli -District, Tamilnadu, India</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          <span>FastAPI Engine Active</span>
        </div>
      </div>

      {/* Main Header / Horizontal Navbar */}
      <header className="bg-[var(--bg-sidebar)] border-b border-[var(--border-color)] sticky top-0 z-40 transition-colors duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo & Brand Title */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-primary)] text-white shadow-sm transition-transform hover:scale-105">
              <GiCow className="text-xl" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide text-[var(--text-primary)] leading-none uppercase">Dhushyanthan M</h2>
              <span className="text-[10px] text-[var(--color-brand-primary)] font-bold tracking-wider uppercase">Dairy Analytics Portal</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-150 ${
                      isActive
                        ? 'sidebar-link-active'
                        : 'text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-[var(--text-primary)] border border-transparent'
                    }`
                  }
                >
                  <Icon className="text-sm flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Menu Buttons */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="rounded-xl p-2.5 text-[var(--text-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-[var(--text-primary)] border border-[var(--border-color)]"
            >
              {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav Menu */}
        {sidebarOpen && (
          <div className="border-t border-[var(--border-color)] bg-[var(--bg-sidebar)] px-4 py-3 lg:hidden space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.name}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold tracking-wide transition-all duration-150 ${
                      isActive
                        ? 'sidebar-link-active'
                        : 'text-[var(--text-secondary)] hover:bg-slate-105 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-[var(--text-primary)] border border-transparent'
                    }`
                  }
                >
                  <Icon className="text-base flex-shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Page Content Wrapper */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#111827] text-slate-400 border-t border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column 1: Info */}
            <div className="space-y-4 md:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand-primary)] text-white shadow-sm">
                  <GiCow className="text-lg" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-wide text-white leading-none uppercase">Dhushyanthan M</h3>
                  <span className="text-[10px] text-[var(--color-brand-primary)] font-bold tracking-wider uppercase">Dairy Analytics Portal</span>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-400 pr-4">
                Dhushyanthan M, Tirunelveli -District, Tamilnadu, India. Leveraging Machine Learning models to optimize milk yield predictions, analyze breed persistence, and support dairy herd decisions in Tamilnadu, Kerala, Andhra Pradesh, Telangana, and Karnataka.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-brand-primary)]">📞</span>
                  <span>+91 76958 18365</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-brand-primary)]">✉️</span>
                  <span>duskydon004@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--color-brand-primary)]">🌐</span>
                  <span>github.com/duskydon004</span>
                </div>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <NavLink to="/" className="hover:text-white transition-colors">Dashboard Overview</NavLink>
                </li>
                <li>
                  <NavLink to="/predict" className="hover:text-white transition-colors">Yield Predictor</NavLink>
                </li>
                <li>
                  <NavLink to="/analytics" className="hover:text-white transition-colors">Analytics Hub</NavLink>
                </li>
                <li>
                  <NavLink to="/insights" className="hover:text-white transition-colors">Feature Insights</NavLink>
                </li>
                <li>
                  <NavLink to="/history" className="hover:text-white transition-colors">Prediction History</NavLink>
                </li>
              </ul>
            </div>

            {/* Column 3: Subscribe */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Subscribe Us</h4>
              <p className="text-xs leading-relaxed text-slate-400">
                Receive weekly automated farm summaries and prediction logs.
              </p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[var(--color-brand-primary)] flex-1 min-w-0"
                />
                <button className="bg-[var(--color-brand-primary)] hover:bg-[var(--color-brand-hover)] text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all active:scale-95">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-6">
              <span>Designed by e Market</span>
              <span className="text-slate-600">|</span>
              <span>© {new Date().getFullYear()} Dhushyanthan M. All rights reserved.</span>
            </div>
            <div className="text-slate-500 italic">
              "Take care of your animals when hot weather hits"
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
