import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiCpu, FiActivity, FiUser, FiBell, FiSliders, FiCheck } from 'react-icons/fi';
import apiService from '../../../services/api';

const SettingsPage = () => {
  const [profile, setProfile] = useState({
    name: 'Dhushyanthan M',
    role: 'Farm Operations Director',
    farmName: 'Antigravity Dairy Holdings',
    email: 'operations@antigravityfarm.com'
  });

  const [notifications, setNotifications] = useState({
    predictionAlerts: true,
    climateWarnings: true,
    reportReminders: false
  });

  const [isDark, setIsDark] = useState(true);
  const [themeColor, setThemeColor] = useState('emerald');
  const [apiOnline, setApiOnline] = useState(false);
  const [checkingApi, setCheckingApi] = useState(true);

  // Initialize theme states
  useEffect(() => {
    // 1. Dark mode
    const darkSetting = !document.documentElement.classList.contains('light') && document.documentElement.classList.contains('dark');
    setIsDark(darkSetting);

    // 2. Theme color
    const savedColor = localStorage.getItem('theme-color') || 'emerald';
    setThemeColor(savedColor);

    // 3. Health ping
    const pingApi = async () => {
      const online = await apiService.pingHealth();
      setApiOnline(online);
      setCheckingApi(false);
    };
    pingApi();
  }, []);

  const handleDarkToggle = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const handleThemeColorChange = (color) => {
    // Remove previous theme classes
    const colors = ['emerald', 'cyan', 'indigo', 'amber', 'rose'];
    colors.forEach(c => document.documentElement.classList.remove(`theme-${c}`));

    // Add new theme class
    document.documentElement.classList.add(`theme-${color}`);
    localStorage.setItem('theme-color', color);
    setThemeColor(color);
  };

  const colorsList = [
    { id: 'emerald', name: 'Emerald', class: 'bg-emerald-500' },
    { id: 'cyan', name: 'Cyan', class: 'bg-cyan-500' },
    { id: 'indigo', name: 'Indigo', class: 'bg-indigo-500' },
    { id: 'amber', name: 'Amber', class: 'bg-amber-500' },
    { id: 'rose', name: 'Rose', class: 'bg-rose-500' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white m-0">Settings</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Configure profile, toggle interface parameters, and inspect API health</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Section 1: Profile */}
          <div className="glass-card rounded-2xl p-6 space-y-5 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2 uppercase tracking-wider">
              <FiUser className="text-emerald-500 dark:text-emerald-400" /> Manager Profile
            </h3>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Role / Position</label>
                <input
                  type="text"
                  value={profile.role}
                  onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Farm Identity</label>
                <input
                  type="text"
                  value={profile.farmName}
                  onChange={(e) => setProfile(prev => ({ ...prev, farmName: e.target.value }))}
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Contact Email</label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-emerald-500/50 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Notifications */}
          <div className="glass-card rounded-2xl p-6 space-y-4 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-2 uppercase tracking-wider">
              <FiBell className="text-emerald-500 dark:text-emerald-400" /> Notifications & Alerts
            </h3>

            <div className="space-y-3.5">
              {/* Alert 1 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Prediction Threshold Alerts</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">Notify if yield prediction falls below base lines</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.predictionAlerts}
                  onChange={(e) => setNotifications(prev => ({ ...prev, predictionAlerts: e.target.checked }))}
                  className="h-5 w-5 rounded-lg border-slate-350 dark:border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Alert 2 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Climate Warnings</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">Warn if ambient temperature exceeds thermal safety thresholds</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.climateWarnings}
                  onChange={(e) => setNotifications(prev => ({ ...prev, climateWarnings: e.target.checked }))}
                  className="h-5 w-5 rounded-lg border-slate-350 dark:border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </div>

              {/* Alert 3 */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Weekly Report Summaries</span>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight block">Receive automated PDF summaries on farm outputs</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.reportReminders}
                  onChange={(e) => setNotifications(prev => ({ ...prev, reportReminders: e.target.checked }))}
                  className="h-5 w-5 rounded-lg border-slate-350 dark:border-slate-700 text-emerald-500 focus:ring-0 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Section 3: Theme Settings */}
          <div className="glass-card rounded-2xl p-6 space-y-6 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1 uppercase tracking-wider">
              <FiSliders className="text-emerald-500 dark:text-emerald-400" /> Interface Customization
            </h3>

            {/* Dark Mode Toggle */}
            <div className="flex items-center justify-between border-b border-slate-200/50 dark:border-slate-850 pb-4">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Dark Mode Selection</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Toggle dark mode visual layout</span>
              </div>
              <button
                onClick={handleDarkToggle}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[var(--text-primary)] hover:border-emerald-500/40 active:scale-95 transition-all cursor-pointer"
              >
                {isDark ? (
                  <>
                    <FiSun className="text-amber-400" /> Switch Light
                  </>
                ) : (
                  <>
                    <FiMoon className="text-indigo-500" /> Switch Dark
                  </>
                )}
              </button>
            </div>

            {/* Theme Colors */}
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Accent Brand Color</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block mb-2">Change highlights and button gradients</span>
              </div>
              <div className="flex items-center gap-3">
                {colorsList.map((col) => {
                  const isActive = themeColor === col.id;
                  return (
                    <button
                      key={col.id}
                      onClick={() => handleThemeColorChange(col.id)}
                      className={`h-9 w-9 rounded-full ${col.class} flex items-center justify-center text-white font-bold relative hover:scale-105 active:scale-95 transition-transform cursor-pointer`}
                      title={col.name}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeThemeColorCheck"
                          className="absolute inset-0 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px]"
                        >
                          <FiCheck />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 4: Engine details & API Status */}
          <div className="glass-card rounded-2xl p-6 space-y-4.5 border border-slate-200/50 dark:border-slate-800/40">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-1.5 uppercase tracking-wider">
              <FiCpu className="text-emerald-500 dark:text-emerald-400" /> Machine Learning Engine
            </h3>

            {/* Grid stats */}
            <div className="grid grid-cols-2 gap-4 text-xs font-medium border-b border-slate-200/50 dark:border-slate-850 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-550 dark:text-slate-450 block uppercase tracking-wider">Inference Engine</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block">XGBoost Regressor</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-550 dark:text-slate-450 block uppercase tracking-wider">Parameters Rank</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block">39 Feature Inputs</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-550 dark:text-slate-450 block uppercase tracking-wider">Engine Version</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block truncate" title="2026-07-09T13:49:10Z">
                  2026-07-09T13:49:10Z
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-550 dark:text-slate-450 block uppercase tracking-wider">Loss Metric (MAE)</span>
                <span className="text-slate-800 dark:text-slate-200 font-bold block">0.85 L / prediction</span>
              </div>
            </div>

            {/* API Status ping check */}
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">FastAPI Server Connection</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-450">Check health of the backend API endpoints</span>
              </div>
              
              {checkingApi ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-400 border-t-emerald-500" />
              ) : apiOnline ? (
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> API Connected
                </div>
              ) : (
                <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[10px] text-amber-600 dark:text-amber-400 font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Offline (Simulated)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;
