import React from 'react';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export const YieldTrendsChart = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Average Daily Yield (Liters)',
        data: [23.4, 24.1, 23.8, 24.6, 25.2, 24.3, 24.9],
        borderColor: '#10B981', // Milk Yield Green
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.15)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#10B981',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: { size: 13, weight: 'bold', family: 'Inter' },
        bodyFont: { size: 12, family: 'Inter' },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `Avg Yield: ${Number(context.raw).toFixed(1)} L`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'Inter' },
        },
      },
      y: {
        grid: {
          color: 'rgba(100, 116, 139, 0.08)',
        },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'Inter' },
          callback: (value) => `${Number(value).toFixed(1)} L`,
        },
      },
    },
  };

  return (
    <div className="h-72 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export const BreedDistChart = ({ breedData = {} }) => {
  const breeds = Object.keys(breedData);
  const counts = Object.values(breedData);

  const data = {
    labels: breeds,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          'rgba(16, 185, 129, 0.85)',  // Milk Yield Green (#10B981)
          'rgba(37, 99, 235, 0.85)',   // Prediction Blue (#2563EB)
          'rgba(139, 92, 246, 0.85)',  // Analytics Purple (#8B5CF6)
          'rgba(6, 182, 212, 0.85)',   // History Cyan (#06B6D4)
        ],
        borderColor: '#1e293b',
        borderWidth: 2,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'var(--text-primary)',
          font: { size: 11, family: 'Inter' },
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.05)',
        borderWidth: 1,
      },
    },
    cutout: '70%',
  };

  return (
    <div className="h-64 w-full flex items-center justify-center">
      {breeds.length > 0 ? (
        <Doughnut data={data} options={options} />
      ) : (
        <p className="text-sm text-slate-400">No breed data available</p>
      )}
    </div>
  );
};
