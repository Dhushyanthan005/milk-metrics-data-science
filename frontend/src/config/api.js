import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
});

// Utility to get local prediction logs
export const getLocalPredictions = () => {
  try {
    return JSON.parse(localStorage.getItem('smart_dairy_local_predictions') || '[]');
  } catch (e) {
    return [];
  }
};

// Utility to save a new local prediction log
export const saveLocalPrediction = (record) => {
  try {
    const existing = getLocalPredictions();
    // avoid duplicates
    if (!existing.some(r => r.id === record.id || (r.timestamp === record.timestamp && r.predicted_yield === record.predicted_yield))) {
      existing.unshift(record);
      localStorage.setItem('smart_dairy_local_predictions', JSON.stringify(existing.slice(0, 200)));
    }
  } catch (e) {
    console.error('Error saving local prediction:', e);
  }
};

// Initial base mock history
const baseMockHistory = [
  {
    id: '1',
    timestamp: new Date().toISOString(),
    input_features: {
      cattle_id: 101,
      breed: 'Holstein',
      age: 4,
      weight: 620,
      feed_quantity: 16.5,
      water_intake: 85,
      temperature: 20.5,
      humidity: 62,
      season: 'spring',
      disease_status: false,
      body_condition_score: 3.5,
      days_in_milk: 110,
      parity: 2
    },
    predicted_yield: 26.8,
    model_version: '2026-07-09T13:49:10Z'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    input_features: {
      cattle_id: 102,
      breed: 'Jersey',
      age: 3,
      weight: 480,
      feed_quantity: 12.0,
      water_intake: 70,
      temperature: 28.0,
      humidity: 75,
      season: 'summer',
      disease_status: false,
      body_condition_score: 3.0,
      days_in_milk: 80,
      parity: 1
    },
    predicted_yield: 19.4,
    model_version: '2026-07-09T13:49:10Z'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
    input_features: {
      cattle_id: 103,
      breed: 'Holstein',
      age: 5,
      weight: 680,
      feed_quantity: 18.0,
      water_intake: 90,
      temperature: 15.0,
      humidity: 50,
      season: 'winter',
      disease_status: true,
      body_condition_score: 3.2,
      days_in_milk: 150,
      parity: 3
    },
    predicted_yield: 14.8,
    model_version: '2026-07-09T13:49:10Z'
  }
];

const mockFeatureImportance = {
  labels: ['Previous_Week_Avg_Yield', 'Breed', 'Lactation_Stage', 'Disease_Status', 'Days_in_Milk', 'Age_Months', 'Weight_kg', 'Feed_Quantity_kg', 'Ambient_Temperature_C', 'Water_Intake_L'],
  datasets: [{
    label: 'Feature importance',
    data: [0.9338, 0.0087, 0.0064, 0.0051, 0.0035, 0.0028, 0.0021, 0.0018, 0.0015, 0.0011],
    backgroundColor: [
      'rgba(16, 185, 129, 0.85)',
      'rgba(6, 182, 212, 0.85)',
      'rgba(59, 130, 246, 0.85)',
      'rgba(99, 102, 241, 0.85)',
      'rgba(139, 92, 246, 0.85)',
      'rgba(168, 85, 247, 0.85)',
      'rgba(236, 72, 153, 0.85)',
      'rgba(244, 63, 94, 0.85)',
      'rgba(245, 158, 11, 0.85)',
      'rgba(234, 179, 8, 0.85)'
    ]
  }]
};

// Helper to compile dynamic history
export const getCombinedHistory = () => {
  const local = getLocalPredictions();
  const map = new Map();
  [...local, ...baseMockHistory].forEach(item => {
    const key = item.id || (item.timestamp + '_' + item.predicted_yield);
    if (!map.has(key)) map.set(key, item);
  });
  return Array.from(map.values());
};

// Compute dynamic analytics summary
export const getDynamicAnalyticsMock = () => {
  const history = getCombinedHistory();
  const local = getLocalPredictions();
  
  const todayStr = new Date().toDateString();
  const todaysRuns = 36 + local.filter(item => item.timestamp && new Date(item.timestamp).toDateString() === todayStr).length;
  const totalPredictions = 1248 + local.length;

  let avgYield = 24.3;
  let avgTemp = 21.8;
  let avgHumidity = 65.0;

  if (history.length > 0) {
    const validYields = history.map(h => h.predicted_yield).filter(Boolean);
    if (validYields.length) avgYield = roundTo(validYields.reduce((a,b)=>a+b,0)/validYields.length, 1);
    
    const validTemps = history.map(h => h.input_features?.temperature).filter(t => typeof t === 'number');
    if (validTemps.length) avgTemp = roundTo(validTemps.reduce((a,b)=>a+b,0)/validTemps.length, 1);

    const validHum = history.map(h => h.input_features?.humidity).filter(h => typeof h === 'number');
    if (validHum.length) avgHumidity = roundTo(validHum.reduce((a,b)=>a+b,0)/validHum.length, 1);
  }

  return {
    average_milk_yield: avgYield,
    highest_yield: 38.6,
    lowest_yield: 12.1,
    average_temperature: avgTemp,
    average_humidity: avgHumidity,
    average_feed_quantity: 16.4,
    total_predictions: totalPredictions,
    todays_runs: todaysRuns,
    breed_distribution: {
      'Holstein': 45 + local.filter(i => i.input_features?.breed === 'Holstein').length,
      'Jersey': 28 + local.filter(i => i.input_features?.breed === 'Jersey').length,
      'Guernsey': 12 + local.filter(i => i.input_features?.breed === 'Guernsey').length,
      'Brown Swiss': 15 + local.filter(i => i.input_features?.breed === 'Brown Swiss').length
    },
    season_distribution: {
      'Summer': 32,
      'Spring': 28,
      'Autumn': 22,
      'Winter': 18
    }
  };
};

function roundTo(val, digits = 1) {
  const factor = Math.pow(10, digits);
  return Math.round(val * factor) / factor;
}

// Axios Interceptor for Offline / Error Mock Fallback
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    console.warn(`API call failed for url: ${config.url}. Falling back to dynamic mock data.`, error.message);
    
    // Simulate server response structure with mock data
    if (config.url.endsWith('/analytics')) {
      return { data: getDynamicAnalyticsMock(), status: 200 };
    }
    if (config.url.endsWith('/feature-importance')) {
      return { data: mockFeatureImportance, status: 200 };
    }
    if (config.url.endsWith('/history')) {
      return { data: getCombinedHistory(), status: 200 };
    }
    if (config.url.endsWith('/predict') && config.method === 'post') {
      const data = JSON.parse(config.data);
      // Generate a realistic yield prediction
      const base = data.breed === 'Holstein' ? 22.0 : 17.0;
      const bcsMod = (data.body_condition_score || 3.0) * 1.5;
      const feedMod = (data.feed_quantity || 10.0) * 0.4;
      const diseasePenalty = data.disease_status ? -5.0 : 0;
      const prediction = Math.max(8.0, base + bcsMod + feedMod + diseasePenalty);
      const roundedYield = Math.round(prediction * 100) / 100;
      
      const newRecord = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        input_features: data,
        predicted_yield: roundedYield,
        model_version: '2026-07-09T13:49:10.027058Z'
      };

      saveLocalPrediction(newRecord);
      
      return {
        data: {
          predicted_milk_yield: roundedYield,
          prediction_time: newRecord.timestamp,
          model_version: '2026-07-09T13:49:10.027058Z',
          confidence_message: data.disease_status ? 'Low confidence: disease symptoms present' : 'Normal confidence'
        },
        status: 200
      };
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
export { mockFeatureImportance };

