import React from 'react';

// Reusable animated skeleton components for premium loading feedback
export const TextSkeleton = ({ className = 'h-4 w-3/4' }) => {
  return (
    <div className={`animate-pulse rounded bg-slate-200/10 dark:bg-slate-800/40 ${className}`} />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-4">
      <div className="flex justify-between items-center">
        <TextSkeleton className="h-3.5 w-1/3" />
        <div className="h-10 w-10 animate-pulse rounded-xl bg-slate-200/10 dark:bg-slate-800/40" />
      </div>
      <TextSkeleton className="h-7 w-1/2" />
      <TextSkeleton className="h-3 w-1/4" />
    </div>
  );
};

export const ChartSkeleton = ({ height = 'h-60' }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-6 flex flex-col justify-between">
      <div className="space-y-2">
        <TextSkeleton className="h-4 w-1/4" />
        <TextSkeleton className="h-3 w-1/3" />
      </div>
      <div className={`${height} w-full animate-pulse rounded-xl bg-slate-200/10 dark:bg-slate-800/40 flex items-end justify-between p-4 gap-2`}>
        <div className="h-1/3 w-full bg-slate-200/5 dark:bg-slate-800/20 rounded-md" />
        <div className="h-2/3 w-full bg-slate-200/5 dark:bg-slate-800/20 rounded-md" />
        <div className="h-1/2 w-full bg-slate-200/5 dark:bg-slate-800/20 rounded-md" />
        <div className="h-3/4 w-full bg-slate-200/5 dark:bg-slate-800/20 rounded-md" />
        <div className="h-5/6 w-full bg-slate-200/5 dark:bg-slate-800/20 rounded-md" />
      </div>
    </div>
  );
};

export const TableSkeleton = ({ rows = 5 }) => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-200/40 dark:border-slate-800/40 space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-2 w-1/3">
          <TextSkeleton className="h-4 w-1/2" />
          <TextSkeleton className="h-3 w-3/4" />
        </div>
        <TextSkeleton className="h-8 w-24 rounded-lg" />
      </div>
      
      <div className="space-y-3.5 pt-4">
        {/* Table Header mock */}
        <div className="grid grid-cols-5 gap-4 border-b border-slate-200/50 dark:border-slate-850 pb-3">
          <TextSkeleton className="h-3 w-3/4" />
          <TextSkeleton className="h-3 w-1/2" />
          <TextSkeleton className="h-3 w-2/3" />
          <TextSkeleton className="h-3 w-1/3" />
          <TextSkeleton className="h-3 w-1/4 text-right" />
        </div>
        {/* Table Rows mock */}
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-5 gap-4 py-2 border-b border-slate-200/20 dark:border-slate-850/30">
            <TextSkeleton className="h-3 w-2/3" />
            <TextSkeleton className="h-3 w-1/3" />
            <TextSkeleton className="h-3 w-3/4" />
            <TextSkeleton className="h-3 w-1/2" />
            <TextSkeleton className="h-3 w-1/3 text-right" />
          </div>
        ))}
      </div>
    </div>
  );
};
