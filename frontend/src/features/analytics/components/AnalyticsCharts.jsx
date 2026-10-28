import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// 1. Prediction Trends Line Chart
export const PredictionTrendsChart = ({ trendData }) => {
  const defaultLabels = ['Jun 20', 'Jun 22', 'Jun 24', 'Jun 26', 'Jun 28', 'Jun 30', 'Jul 02', 'Jul 04', 'Jul 06', 'Jul 08'];
  const defaultValues = [22.4, 23.1, 22.8, 23.5, 24.1, 23.8, 24.6, 25.2, 24.3, 24.9];

  const data = {
    labels: trendData?.labels || defaultLabels,
    datasets: [
      {
        label: 'Prediction Trend (Liters)',
        data: trendData?.values || defaultValues,
        borderColor: '#06b6d4', // cyan-500
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 220);
          gradient.addColorStop(0, 'rgba(6, 182, 212, 0.2)');
          gradient.addColorStop(1, 'rgba(6, 182, 212, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        borderWidth: 2.5,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 1.5,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a', padding: 10, cornerRadius: 6 },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.03)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (value) => `${Number(value).toFixed(1)} L`,
        },
      },
    },
  };

  return (
    <div className="h-60 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

// 2. Milk Yield Distribution (Histogram style)
export const YieldDistributionChart = () => {
  const data = {
    labels: ['< 15L', '15L - 20L', '20L - 25L', '25L - 30L', '30L - 35L', '> 35L'],
    datasets: [
      {
        data: [12, 28, 45, 34, 18, 8],
        backgroundColor: 'rgba(16, 185, 129, 0.75)', // emerald
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a' },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.03)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
    },
  };

  return (
    <div className="h-60 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

// 3. Breed Comparison (Average Yield by Breed)
export const BreedComparisonChart = () => {
  const data = {
    labels: ['Holstein', 'Jersey', 'Guernsey', 'Brown Swiss', 'Ayrshire'],
    datasets: [
      {
        data: [28.2, 19.4, 21.8, 22.6, 20.9],
        backgroundColor: [
          'rgba(16, 185, 129, 0.75)', // emerald
          'rgba(6, 182, 212, 0.75)',  // cyan
          'rgba(59, 130, 246, 0.75)',  // blue
          'rgba(139, 92, 246, 0.75)',  // purple
          'rgba(236, 72, 153, 0.75)',  // pink
        ],
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a' },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.03)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (value) => `${Number(value).toFixed(1)} L`,
        },
        min: 10,
      },
    },
  };

  return (
    <div className="h-60 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

// 4. Season Comparison (Average Yield by Season)
export const SeasonComparisonChart = () => {
  const data = {
    labels: ['Spring', 'Summer', 'Autumn', 'Winter'],
    datasets: [
      {
        data: [25.4, 23.1, 24.2, 21.8],
        backgroundColor: 'rgba(245, 158, 11, 0.75)', // amber
        borderColor: 'rgba(245, 158, 11, 1)',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a' },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.03)' },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          callback: (value) => `${Number(value).toFixed(1)} L`,
        },
        min: 15,
      },
    },
  };

  return (
    <div className="h-60 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};

// 5. Feature Importance Horizontal Bar
export const FeatureImportanceChart = ({ importanceData }) => {
  const defaultLabels = ['Prev_Yield', 'Breed', 'Lactation', 'Disease', 'Days_in_Milk', 'BCS'];
  const defaultData = [0.9338, 0.0087, 0.0064, 0.0051, 0.0035, 0.0028];

  const data = {
    labels: importanceData?.labels?.slice(0, 6) || defaultLabels,
    datasets: [
      {
        data: importanceData?.datasets?.[0]?.data?.slice(0, 6) || defaultData,
        backgroundColor: 'rgba(139, 92, 246, 0.75)', // purple
        borderWidth: 0,
        borderRadius: 6,
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { backgroundColor: '#0f172a' },
    },
    scales: {
      x: { grid: { color: 'rgba(148, 163, 184, 0.03)' }, ticks: { color: '#94a3b8', font: { size: 10 } } },
      y: { grid: { display: false }, ticks: { color: '#f1f5f9', font: { size: 10 } } },
    },
  };

  return (
    <div className="h-60 w-full">
      <Bar data={data} options={options} />
    </div>
  );
};
