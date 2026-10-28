import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiCpu, FiAlertTriangle } from 'react-icons/fi';
import { GiMilkCarton } from 'react-icons/gi';

const PredictionResult = ({ result }) => {
  if (!result) return null;

  const isLowConfidence = result.confidence_message && result.confidence_message.toLowerCase().includes('low');

  // Percentage value for gauge
  const maxYieldRange = 40; // Liters
  const gaugePercent = Math.min(100, (result.predicted_milk_yield / maxYieldRange) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        boxShadow: [
          "0 10px 15px -3px rgba(59, 130, 246, 0.05), 0 4px 6px -4px rgba(59, 130, 246, 0.05)",
          "0 20px 25px -5px rgba(16, 185, 129, 0.3), 0 8px 10px -6px rgba(16, 185, 129, 0.3)",
          "0 10px 15px -3px rgba(59, 130, 246, 0.1), 0 4px 6px -4px rgba(59, 130, 246, 0.1)"
        ]
      }}
      transition={{ 
        type: 'spring', 
        stiffness: 80, 
        damping: 15,
        boxShadow: { duration: 1.5, ease: "easeInOut" }
      }}
      className="glass-card rounded-2xl p-6 border border-emerald-500/20 dark:border-emerald-500/30 shadow-lg relative overflow-hidden flex flex-col items-center text-center space-y-6"
    >
      {/* Success Glow Ring */}
      <motion.div 
        initial={{ opacity: 0.5, scale: 0.8 }}
        animate={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 border-2 border-emerald-500 rounded-2xl pointer-events-none"
      />

      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />

      {/* Success Badge with scale and spin */}
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, delay: 0.15 }}
        className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-3.5 py-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider"
      >
        <FiCheckCircle className="text-sm animate-pulse" /> Prediction Computed!
      </motion.div>

      {/* Radial Gauge Visual */}
      <div className="relative flex items-center justify-center h-48 w-48">
        {/* Outer Circular Track */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="rgba(30, 41, 59, 0.08)"
            strokeWidth="8"
            fill="transparent"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#blueIndigoGrad)"
            strokeWidth="8"
            fill="transparent"
            initial={{ strokeDashoffset: 263.89 }}
            animate={{ strokeDashoffset: 263.89 - (263.89 * gaugePercent) / 100 }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            strokeDasharray={263.89}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="blueIndigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Core Yield Text */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute flex flex-col items-center justify-center"
        >
          <GiMilkCarton className="text-3xl text-emerald-500 dark:text-emerald-400 mb-1" />
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white leading-none">
            {result.predicted_milk_yield.toFixed(1)}
          </h2>
          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-1">Liters / Day</span>
        </motion.div>
      </div>

      {/* Confidence Score Display */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="w-full space-y-2"
      >
        <div
          className={`flex items-center justify-center gap-2 rounded-xl p-3.5 border text-xs font-semibold ${
            isLowConfidence
              ? 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              : 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {isLowConfidence ? <FiAlertTriangle className="text-base" /> : <FiCheckCircle className="text-base" />}
          {result.confidence_message}
        </div>
      </motion.div>

      {/* Meta Info Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="w-full border-t border-slate-200/50 dark:border-slate-800/40 pt-4 grid grid-cols-2 gap-4 text-left"
      >
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase flex items-center gap-1">
            <FiClock /> Time stamp
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-250 block truncate">
            {new Date(result.prediction_time).toLocaleTimeString()}
          </span>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold uppercase flex items-center gap-1">
            <FiCpu /> Engine Ver.
          </span>
          <span className="text-xs text-slate-700 dark:text-slate-250 block truncate">
            XGBoost (v{result.model_version.substring(0, 10)})
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const PredictionResultSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800/40 shadow-sm relative overflow-hidden flex flex-col items-center text-center space-y-6 animate-pulse">
      {/* Top status */}
      <div className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3.5 py-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Calculating Yield...
      </div>

      {/* Radial circle loading visual */}
      <div className="relative flex items-center justify-center h-48 w-48">
        <svg className="w-full h-full transform -rotate-90 animate-spin" style={{ animationDuration: '3s' }} viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="rgba(30, 41, 59, 0.04)"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="rgba(37, 99, 235, 0.15)"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={263.89}
            strokeDashoffset={263.89 - (263.89 * 35) / 100}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center space-y-2">
          <div className="h-6 w-6 rounded bg-slate-200/25 dark:bg-slate-800/40" />
          <div className="h-8 w-16 rounded bg-slate-200/25 dark:bg-slate-800/40" />
          <div className="h-3 w-12 rounded bg-slate-200/25 dark:bg-slate-800/40" />
        </div>
      </div>

      {/* Confidence Msg skeleton */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 h-12" />

      {/* Meta Info Grid skeleton */}
      <div className="w-full border-t border-slate-200/50 dark:border-slate-800/40 pt-4 grid grid-cols-2 gap-4 text-left">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-slate-200/25 dark:bg-slate-800/40" />
          <div className="h-4 w-24 rounded bg-slate-200/25 dark:bg-slate-800/40" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 rounded bg-slate-200/25 dark:bg-slate-800/40" />
          <div className="h-4 w-24 rounded bg-slate-200/25 dark:bg-slate-800/40" />
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
