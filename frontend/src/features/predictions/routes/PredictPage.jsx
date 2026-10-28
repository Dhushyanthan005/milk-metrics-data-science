import React, { useState } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../../services/api';
import { saveLocalPrediction } from '../../../config/api';
import PredictionForm from '../components/PredictionForm';
import PredictionResult, { PredictionResultSkeleton } from '../components/PredictionResult';

const PredictPage = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (data) => {
    setLoading(true);
    setError(null);
    const res = await apiService.predict(data);
    if (res.success) {
      setResult(res.data);
      saveLocalPrediction({
        id: Date.now().toString(),
        timestamp: res.data.prediction_time || new Date().toISOString(),
        input_features: data,
        predicted_yield: res.data.predicted_milk_yield,
        model_version: res.data.model_version || '2026-07-09T13:49:10Z'
      });
    } else {
      setError(res.error || 'Failed to compute prediction. Make sure the API is active.');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Title Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white m-0">Predict Milk Yield</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Run dry matter & climate inference through the trained XGBoost model</p>
      </div>

      {error && (
        <div className="rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-400">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Form Panel */}
        <div className="lg:col-span-2 space-y-6">
          <PredictionForm onSubmit={handlePredict} loading={loading} />
        </div>

        {/* Result Panel */}
        <div className="space-y-6">
          <div className="sticky top-6">
            {loading ? (
              <PredictionResultSkeleton />
            ) : result ? (
              <PredictionResult result={result} key={result.prediction_time} />
            ) : (
              <div className="glass-card rounded-2xl p-8 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center h-80">
                <div className="h-14 w-14 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-2xl mb-4">
                  ?
                </div>
                <h4 className="text-sm font-semibold text-slate-650 dark:text-slate-350">Awaiting Prediction Inputs</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-[200px]">
                  Fill out the parameters on the left and submit to run inference.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PredictPage;
