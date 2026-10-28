import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiChevronDown, FiChevronUp, FiCpu, FiRefreshCw, FiAlertCircle } from 'react-icons/fi';

const PredictionForm = ({ onSubmit, loading }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      breed: 'Holstein',
      age: 4,
      weight: 600.0,
      feed_quantity: 15.0,
      water_intake: 80.0,
      temperature: 20.0,
      humidity: 60.0,
      season: 'summer',
      disease_status: false,
      body_condition_score: 3.5,
      days_in_milk: 60,
      
      // Defaults for advanced
      cattle_id: 1,
      region: 'East',
      country: 'USA',
      climate_zone: 'Temperate',
      management_system: 'Intensive',
      parity: 2,
      lactation_stage: 1,
      feed_type: 'Silage',
      walking_distance_km: 2.5,
      grazing_duration_hrs: 4.0,
      rumination_time_hrs: 8.0,
      resting_hours: 12.0,
      body_temperature_c: 38.5,
      heart_rate_bpm: 60,
      respiratory_rate: 20,
      housing_score: 4.0,
      fmd_vaccine: 1,
      brucellosis_vaccine: 1,
      hs_vaccine: 1,
      bq_vaccine: 1,
      anthrax_vaccine: 1,
      ibr_vaccine: 1,
      bvd_vaccine: 1,
      rabies_vaccine: 1,
      previous_week_avg_yield: 25.0,
      milking_interval_hrs: 12,
      farm_id: 1
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 11 Core Required Fields */}
      <div className="bg-white dark:bg-[#0c1122]/40 rounded-2xl p-6 border border-slate-200 dark:border-slate-800/40 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-350 uppercase tracking-wider mb-2">Core Cow & Environment Variables</h3>
        
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {/* Breed */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Breed</label>
            <select
              {...register('breed', { required: 'Breed selection is required' })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
            >
              <option value="Holstein">Holstein</option>
              <option value="Jersey">Jersey</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Brown Swiss">Brown Swiss</option>
              <option value="Ayrshire">Ayrshire</option>
            </select>
            {errors.breed && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.breed.message}
              </span>
            )}
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Age (Years)</label>
            <input
              type="number"
              {...register('age', { 
                required: 'Age is required', 
                min: { value: 0, message: 'Age cannot be negative' }, 
                max: { value: 30, message: 'Age cannot exceed 30' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 4"
            />
            {errors.age && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.age.message}
              </span>
            )}
          </div>

          {/* Weight */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Weight (kg)</label>
            <input
              type="number"
              step="any"
              {...register('weight', { 
                required: 'Weight is required', 
                min: { value: 10, message: 'Minimum weight is 10 kg' }, 
                max: { value: 2000, message: 'Weight cannot exceed 2000 kg' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 620"
            />
            {errors.weight && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.weight.message}
              </span>
            )}
          </div>

          {/* Feed Quantity */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Feed Quantity (kg/day)</label>
            <input
              type="number"
              step="any"
              {...register('feed_quantity', { 
                required: 'Feed quantity is required', 
                min: { value: 0, message: 'Feed quantity cannot be negative' }, 
                max: { value: 100, message: 'Feed quantity cannot exceed 100 kg' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 15"
            />
            {errors.feed_quantity && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.feed_quantity.message}
              </span>
            )}
          </div>

          {/* Water Intake */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Water Intake (L/day)</label>
            <input
              type="number"
              step="any"
              {...register('water_intake', { 
                required: 'Water intake is required', 
                min: { value: 0, message: 'Water intake cannot be negative' }, 
                max: { value: 500, message: 'Water intake cannot exceed 500 L' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 80"
            />
            {errors.water_intake && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.water_intake.message}
              </span>
            )}
          </div>

          {/* Ambient Temperature */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Ambient Temperature (°C)</label>
            <input
              type="number"
              step="any"
              {...register('temperature', { 
                required: 'Temperature is required', 
                min: { value: -30, message: 'Minimum temperature is -30°C' }, 
                max: { value: 60, message: 'Maximum temperature is 60°C' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 21"
            />
            {errors.temperature && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.temperature.message}
              </span>
            )}
          </div>

          {/* Relative Humidity */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Relative Humidity (%)</label>
            <input
              type="number"
              step="any"
              {...register('humidity', { 
                required: 'Humidity is required', 
                min: { value: 0, message: 'Humidity cannot be negative' }, 
                max: { value: 100, message: 'Humidity cannot exceed 100%' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 60"
            />
            {errors.humidity && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.humidity.message}
              </span>
            )}
          </div>

          {/* Season */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Season</label>
            <select
              {...register('season', { required: 'Season is required' })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
            >
              <option value="spring">Spring</option>
              <option value="summer">Summer</option>
              <option value="autumn">Autumn</option>
              <option value="winter">Winter</option>
            </select>
            {errors.season && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.season.message}
              </span>
            )}
          </div>

          {/* Body Condition Score */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Body Condition Score (BCS 1-5)</label>
            <input
              type="number"
              step="any"
              {...register('body_condition_score', { 
                required: 'BCS is required', 
                min: { value: 1.0, message: 'BCS must be at least 1.0' }, 
                max: { value: 5.0, message: 'BCS cannot exceed 5.0' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 3.5"
            />
            {errors.body_condition_score && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.body_condition_score.message}
              </span>
            )}
          </div>

          {/* Days In Milk */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">Days in Milk (DIM)</label>
            <input
              type="number"
              {...register('days_in_milk', { 
                required: 'Days in Milk is required', 
                min: { value: 0, message: 'Days in Milk cannot be negative' }, 
                max: { value: 2000, message: 'Days in Milk cannot exceed 2000' }, 
                valueAsNumber: true 
              })}
              className="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-3 text-sm text-[var(--text-primary)] focus:border-blue-500/50 focus:outline-none transition-colors"
              placeholder="e.g. 60"
            />
            {errors.days_in_milk && (
              <span className="text-[10px] text-rose-500 font-medium mt-1.5 flex items-center gap-1">
                <FiAlertCircle /> {errors.days_in_milk.message}
              </span>
            )}
          </div>

          {/* Disease Status */}
          <div className="flex items-center gap-3.5 h-full pt-5">
            <input
              type="checkbox"
              id="disease_status"
              {...register('disease_status')}
              className="h-5 w-5 rounded-lg border-slate-350 dark:border-slate-700 text-blue-600 bg-slate-50 dark:bg-slate-900 focus:ring-0 focus:ring-offset-0 transition-colors cursor-pointer"
            />
            <label htmlFor="disease_status" className="text-xs font-semibold text-slate-550 dark:text-slate-400 cursor-pointer select-none">
              Shows Disease Symptoms?
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Parameters Panel (Collapsible) */}
      <div className="bg-slate-50/50 dark:bg-[#0c1122]/10 border border-slate-200 dark:border-slate-800/30 rounded-2xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-6 py-4.5 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100/50 dark:hover:bg-slate-800/10 text-sm transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <FiCpu className="text-blue-600 dark:text-blue-400 text-base" /> Advanced Model Variables (28 optional fields)
          </span>
          {showAdvanced ? <FiChevronUp /> : <FiChevronDown />}
        </button>

        {showAdvanced && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-200/30 dark:border-slate-800/20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {/* Cattle ID */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Cattle ID</label>
              <input
                type="number"
                {...register('cattle_id', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Parity */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Parity (Calvings)</label>
              <input
                type="number"
                {...register('parity', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Lactation Stage */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Lactation Stage (1-4)</label>
              <input
                type="number"
                {...register('lactation_stage', { min: 1, max: 4, valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Feed Type */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Feed Type</label>
              <input
                type="text"
                {...register('feed_type')}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Previous Week Avg Yield */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Prev Week Avg Yield (L)</label>
              <input
                type="number"
                step="any"
                {...register('previous_week_avg_yield', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Milking Interval */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Milking Interval (Hours)</label>
              <input
                type="number"
                {...register('milking_interval_hrs', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Region */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Region</label>
              <input
                type="text"
                {...register('region')}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Climate Zone */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Climate Zone</label>
              <input
                type="text"
                {...register('climate_zone')}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            {/* Management System */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Management System</label>
              <input
                type="text"
                {...register('management_system')}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>
            
            {/* Health parameters */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Body Temp (°C)</label>
              <input
                type="number"
                step="any"
                {...register('body_temperature_c', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Heart Rate (bpm)</label>
              <input
                type="number"
                {...register('heart_rate_bpm', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-450 mb-1.5">Respiratory Rate</label>
              <input
                type="number"
                {...register('respiratory_rate', { valueAsNumber: true })}
                className="w-full rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 px-4 py-2.5 text-xs text-[var(--text-primary)] focus:border-blue-500/40 focus:outline-none transition-colors"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-650 py-4 text-sm font-bold text-white shadow-md hover:shadow-blue-500/10 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
      >
        {loading ? (
          <>
            <FiRefreshCw className="animate-spin text-lg" /> Computing Inference...
          </>
        ) : (
          <>
            Run Predictive Inference
          </>
        )}
      </button>
    </form>
  );
};

export default PredictionForm;
