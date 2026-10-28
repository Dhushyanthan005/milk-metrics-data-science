import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiLayers, FiSun, FiMap, FiPercent } from 'react-icons/fi';
import apiService from '../../../services/api';
import {
  PredictionTrendsChart,
  YieldDistributionChart,
  BreedComparisonChart,
  SeasonComparisonChart,
  FeatureImportanceChart
} from '../components/AnalyticsCharts';
import { CardSkeleton, ChartSkeleton } from '../../../components/Skeleton';

const AnalyticsPage = () => {
  const [stats, setStats] = useState(null);
  const [importance, setImportance] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      const [statsRes, importanceRes, historyRes] = await Promise.all([
        apiService.getAnalytics(),
        apiService.getFeatureImportance(),
        apiService.getHistory(),
      ]);
      
      if (statsRes.success) setStats(statsRes.data);
      if (importanceRes.success) setImportance(importanceRes.data);
      if (historyRes.success) setHistory(historyRes.data);
      
      setLoading(false);
    };
    fetchAnalyticsData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-7 w-1/4 rounded bg-slate-200/10 dark:bg-slate-800/40 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-slate-250/10 dark:bg-slate-800/40 animate-pulse" />
        </div>
        
        <div className="grid gap-5 sm:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <ChartSkeleton height="h-60" />
          <ChartSkeleton height="h-60" />
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <ChartSkeleton height="h-60" />
          <ChartSkeleton height="h-60" />
        </div>
        
        <ChartSkeleton height="h-60" />
      </div>
    );
  }

  const displayStats = stats || {
    average_milk_yield: 24.3,
    highest_yield: 38.6,
    lowest_yield: 12.1,
  };

  // Convert prediction history into chart trends
  const trendData = {
    labels: history.slice(0, 10).reverse().map(h => new Date(h.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })),
    values: history.slice(0, 10).reverse().map(h => h.predicted_yield)
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-10"
    >
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white m-0">Analytics Hub</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Advanced comparison indexes and model performance metrics</p>
      </div>

      {/* Summary Stats Row */}
      <motion.div variants={itemVariants} className="grid gap-5 sm:grid-cols-3">
        {/* Average Milk Yield Card */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 dark:text-slate-450 font-medium uppercase tracking-wider">Average Yield</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-none">
              {displayStats.average_milk_yield ? `${displayStats.average_milk_yield.toFixed(1)} L` : '24.3 L'}
            </h3>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <FiTrendingUp /> Optimal baseline
            </span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-xl shadow-inner">
            <FiActivity />
          </div>
        </div>

        {/* Total Runs Card */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs text-slate-500 dark:text-slate-450 font-medium uppercase tracking-wider">Data Points</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-none">
              1,248
            </h3>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Evaluated records</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center text-xl shadow-inner">
            <FiLayers />
          </div>
        </div>

        {/* Global R-Square Value */}
        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-xs text-slate-550 dark:text-slate-450 font-medium uppercase tracking-wider">Model Fit (R²)</span>
            <h3 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-none">
              0.964
            </h3>
            <span className="text-[10px] text-cyan-600 dark:text-cyan-400 font-bold">XGBoost regression variance</span>
          </div>
          <div className="h-12 w-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 flex items-center justify-center text-xl shadow-inner">
            <FiPercent />
          </div>
        </div>
      </motion.div>

      {/* Row 2: Prediction Trends and Yield Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Prediction Trends */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white leading-none">Prediction Trends</h4>
            <span className="text-[11px] text-slate-550 dark:text-slate-400">Inference values over the 10 most recent runs</span>
          </div>
          <div className="flex-1 flex items-end">
            <PredictionTrendsChart trendData={trendData.values.length > 0 ? trendData : null} />
          </div>
        </motion.div>

        {/* Yield Distribution */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-4">
            <h4 className="text-base font-bold text-slate-800 dark:text-white leading-none">Milk Yield Distribution</h4>
            <span className="text-[11px] text-slate-550 dark:text-slate-400">Frequency distribution of cows across yield brackets</span>
          </div>
          <div className="flex-1 flex items-end">
            <YieldDistributionChart />
          </div>
        </motion.div>
      </div>

      {/* Row 3: Breed Comparison and Season Comparison */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Breed Comparison */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white leading-none">Breed Yield Comparison</h4>
              <span className="text-[11px] text-slate-550 dark:text-slate-400">Average milk yield volume across breeds</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center text-sm">
              <FiMap />
            </div>
          </div>
          <div className="flex-1 flex items-end">
            <BreedComparisonChart />
          </div>
        </motion.div>

        {/* Season Comparison */}
        <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6 flex flex-col justify-between">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-slate-800 dark:text-white leading-none">Season Yield Comparison</h4>
              <span className="text-[11px] text-slate-550 dark:text-slate-400">Climate effects on average milk yield volume</span>
            </div>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center text-sm">
              <FiSun />
            </div>
          </div>
          <div className="flex-1 flex items-end">
            <SeasonComparisonChart />
          </div>
        </motion.div>
      </div>

      {/* Row 4: Feature Importance Summary */}
      <motion.div variants={itemVariants} className="glass-card rounded-2xl p-6">
        <div className="mb-4">
          <h4 className="text-base font-bold text-slate-800 dark:text-white leading-none">Inference Feature Rankings</h4>
          <span className="text-[11px] text-slate-550 dark:text-slate-400 font-medium">Relative feature importance (gain) extracted from XGBoost model</span>
        </div>
        <div className="flex-1 flex items-end">
          <FeatureImportanceChart importanceData={importance} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsPage;
