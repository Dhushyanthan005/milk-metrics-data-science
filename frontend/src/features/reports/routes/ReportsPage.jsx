import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiDownload, FiFileText, FiTrendingUp, FiDatabase, FiAward, FiCheck } from 'react-icons/fi';
import apiService from '../../../services/api';
import {
  generatePredictionReport,
  generateAnalyticsReport,
  generatePerformanceReport
} from '../utils/pdfGenerator';

const ReportsPage = () => {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [downloading, setDownloading] = useState({
    prediction: false,
    analytics: false,
    performance: false
  });

  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, historyRes] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getHistory(),
      ]);
      if (statsRes.success) setStats(statsRes.data);
      if (historyRes.success) setHistory(historyRes.data);
    };
    fetchData();
  }, []);

  const triggerDownload = (type) => {
    // Micro-spinner animation overlay for 800ms before saving
    setDownloading(prev => ({ ...prev, [type]: true }));
    setTimeout(() => {
      try {
        if (type === 'prediction') generatePredictionReport(history);
        if (type === 'analytics') generateAnalyticsReport(stats);
        if (type === 'performance') generatePerformanceReport();
      } catch (e) {
        console.error(e);
      } finally {
        setDownloading(prev => ({ ...prev, [type]: false }));
      }
    }, 850);
  };

  const reportsList = [
    {
      id: 'prediction',
      title: 'Prediction Audit Report',
      desc: 'Complete history log of computed cow predictions containing dates, cow identifiers, features, and model outputs.',
      icon: FiDatabase,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30',
      actionText: 'Download Prediction Log'
    },
    {
      id: 'analytics',
      title: 'Analytics & Trends Report',
      desc: 'Aggregated barn comparisons across seasons, breed averages, temperature profiles, and overall performance matrices.',
      icon: FiTrendingUp,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30',
      actionText: 'Download Analytics Summary'
    },
    {
      id: 'performance',
      title: 'ML Engine Performance Report',
      desc: 'XGBoost regression validation metrics including R-square coefficient weights, error residuals, and top feature gain weights.',
      icon: FiAward,
      color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-100/50 dark:border-blue-900/30',
      actionText: 'Download Performance Profile'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white m-0">Farm Reports</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Download printable PDF audits of predictions, comparisons, and accuracy metrics</p>
      </div>

      {/* Reports Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reportsList.map((rep) => {
          const Icon = rep.icon;
          const isSaving = downloading[rep.id];

          return (
            <div
              key={rep.id}
              className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800/40 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Visual Icon Badge */}
                <div className={`h-12 w-12 rounded-xl ${rep.color} flex items-center justify-center text-xl shadow-sm`}>
                  <Icon />
                </div>

                <div className="space-y-2">
                  <h4 className="text-base font-bold text-slate-800 dark:text-white leading-none">{rep.title}</h4>
                  <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{rep.desc}</p>
                </div>
              </div>

              {/* Download Action button */}
              <button
                onClick={() => triggerDownload(rep.id)}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500/30 text-xs font-bold text-[var(--text-primary)] hover:text-blue-600 dark:hover:text-blue-400 py-3.5 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-slate-350 dark:border-slate-700 border-t-blue-600" />
                    Assembling PDF Document...
                  </>
                ) : (
                  <>
                    <FiDownload /> {rep.actionText}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ReportsPage;
