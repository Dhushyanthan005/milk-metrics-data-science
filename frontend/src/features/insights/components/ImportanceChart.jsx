import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ImportanceChart = ({ chartData }) => {
  if (!chartData) return null;

  const options = {
    indexAxis: 'y', // Horizontal bars
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 8,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(100, 116, 139, 0.06)',
        },
        ticks: {
          color: '#64748b',
          font: { size: 11, family: 'Inter' },
          callback: (value) => `${(value * 100).toFixed(1)}%`,
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#475569',
          font: { size: 11, family: 'Inter', weight: '500' },
        },
      },
    },
  };

  return (
    <div className="h-[480px] w-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ImportanceChart;
