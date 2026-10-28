import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiCpu, FiKey, FiInfo } from 'react-icons/fi';
import apiService from '../../../services/api';
import ImportanceChart from '../components/ImportanceChart';
import { ChartSkeleton } from '../../../components/Skeleton';

const InsightsPage = () => {
  const [importance, setImportance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImportance = async () => {
      const res = await apiService.getFeatureImportance();
      if (res.success) {
        setImportance(res.data);
      }
      setLoading(false);
    };
    fetchImportance();
  }, []);

  const explanations = [
    {
      feature: 'Previous_Week_Avg_Yield',
      impact: 'Strong Positive',
      desc: "The single most influential feature. A cow's historical yield rate is the strongest predictor of current day yield due to genetic limits and persistence.",
    },
    {
      feature: 'Breed',
      impact: 'Moderate Positive',
      desc: 'Significant genetic factor. Holsteins generally exhibit the highest base yield capacity, while Jersey cows offer high fat content but lower volume.',
    },
    {
      feature: 'Lactation_Stage',
      impact: 'Cyclic Impact',
      desc: 'Stages of lactation dictate the milk production curve, peaking in early-mid stages and drying off in stage 4.',
    },
    {
      feature: 'Disease_Status',
      impact: 'Strong Negative',
      desc: 'Immediate clinical drop. Active disease symptoms or infection trigger massive drops in lactation rate and increase farm stress indicators.',
    },
    {
      feature: 'Days_in_Milk (DIM)',
      impact: 'Decay Pattern',
      desc: 'Production typically peaks around 40-60 days in milk, after which there is a standard biological decline as lactation progresses.',
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-7 w-1/4 rounded bg-slate-200/10 dark:bg-slate-800/40 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-slate-200/10 dark:bg-slate-800/40 animate-pulse" />
        </div>
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartSkeleton height="h-[480px]" />
          </div>
          <div className="space-y-6">
            <div className="h-10 w-full bg-slate-200/10 dark:bg-slate-800/40 rounded animate-pulse" />
            <div className="h-40 w-full bg-slate-200/10 dark:bg-slate-800/40 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white m-0">Feature Insights</h2>
        <p className="text-sm text-slate-550 dark:text-slate-400">XGBoost model variables rank by gain (relative importance)</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Chart Panel */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white leading-none">Relative Feature Gain</h4>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">Top features prioritized by the ML engine</span>
            </div>
            <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm">
              <FiKey />
            </div>
          </div>

          <div className="relative min-h-[440px] flex items-end">
            <ImportanceChart chartData={importance} />
          </div>
        </div>

        {/* Explainability Panel */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800/40 space-y-3 bg-gradient-to-br from-blue-500/5 to-indigo-500/5">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FiInfo className="text-blue-600 dark:text-blue-400 text-base" /> Model Interpretability
            </h4>
            <p className="text-xs leading-relaxed text-slate-550 dark:text-slate-400">
              The XGBoost model processes 39 distinct variables. Feature importance is computed as the relative statistical gain contribution of each split variable.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Top Predictors Glossary</h4>

            {explanations.map((exp, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4.5 border border-slate-200/40 dark:border-slate-800/30 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">{exp.feature}</span>
                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 rounded-full px-2 py-0.5">
                    {exp.impact}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-550 dark:text-slate-450">{exp.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InsightsPage;
