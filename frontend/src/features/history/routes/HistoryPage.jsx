import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiFilter, FiActivity, FiArrowDown } from 'react-icons/fi';
import apiService from '../../../services/api';
import { TableSkeleton } from '../../../components/Skeleton';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterBreed, setFilterBreed] = useState('All');

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await apiService.getHistory();
      if (res.success) {
        setHistory(res.data);
      }
      setLoading(false);
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <div className="h-7 w-1/4 rounded bg-slate-200/10 dark:bg-slate-800/40 animate-pulse" />
          <div className="h-4 w-1/3 rounded bg-slate-200/10 dark:bg-slate-800/40 animate-pulse" />
        </div>
        <TableSkeleton rows={8} />
      </div>
    );
  }

  const filteredHistory = history.filter((item) => {
    const breedMatch = filterBreed === 'All' || item.input_features.breed.toLowerCase() === filterBreed.toLowerCase();
    
    // search matches cattle ID or breed name
    const cowIdStr = item.input_features.cattle_id?.toString() || '';
    const searchMatch =
      search === '' ||
      cowIdStr.includes(search) ||
      item.input_features.breed.toLowerCase().includes(search.toLowerCase());

    return breedMatch && searchMatch;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-10"
    >
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white m-0">Prediction History</h2>
        <p className="text-sm text-slate-550 dark:text-slate-400">View and audit historical prediction logs stored in the local repository</p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Cattle ID or Breed..."
            className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter breed */}
        <div className="flex items-center gap-3">
          <FiFilter className="text-slate-400 text-sm" />
          <select
            value={filterBreed}
            onChange={(e) => setFilterBreed(e.target.value)}
            className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
          >
            <option value="All">All Breeds</option>
            <option value="Holstein">Holstein</option>
            <option value="Jersey">Jersey</option>
            <option value="Guernsey">Guernsey</option>
            <option value="Brown Swiss">Brown Swiss</option>
          </select>
        </div>
      </div>

      {/* Log Table Card */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800/40">
        <div className="overflow-x-auto">
          {filteredHistory.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0c1122]/30 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4.5">Time Stamp</th>
                  <th className="px-6 py-4.5">Cattle ID</th>
                  <th className="px-6 py-4.5">Breed</th>
                  <th className="px-6 py-4.5 text-center">Age (Y)</th>
                  <th className="px-6 py-4.5 text-center">Weight (kg)</th>
                  <th className="px-6 py-4.5 text-center">BCS</th>
                  <th className="px-6 py-4.5 text-center">Days in Milk</th>
                  <th className="px-6 py-4.5 text-center">Climate</th>
                  <th className="px-6 py-4.5 text-right text-blue-600 dark:text-blue-400">Predicted Yield</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-250/50 dark:divide-slate-800 text-xs font-semibold text-slate-650 dark:text-slate-300">
                {filteredHistory.map((item, index) => (
                  <tr
                    key={item.id || index}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-400">
                      {new Date(item.timestamp).toLocaleString(undefined, {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      #{item.input_features.cattle_id || '1'}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">
                      {item.input_features.breed}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-300">
                      {item.input_features.age}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-500 dark:text-slate-400">
                      {item.input_features.weight} kg
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-0.5 text-slate-600 dark:text-slate-300">
                        {item.input_features.body_condition_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center text-slate-600 dark:text-slate-400">
                      {item.input_features.days_in_milk}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-550 dark:text-slate-400">
                      {item.input_features.temperature}°C / {item.input_features.humidity}%
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-blue-600 dark:text-blue-400 text-sm">
                      {item.predicted_yield.toFixed(1)} L
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
              <FiActivity className="text-slate-400 text-3xl animate-bounce" />
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-800 dark:text-white block">No prediction logs found</span>
                <span className="text-xs text-slate-500 dark:text-slate-400 block">Try clearing filters or search criteria</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default HistoryPage;
