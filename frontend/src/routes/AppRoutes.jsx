import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import DashboardPage from '../features/dashboard/routes/DashboardPage';
import PredictPage from '../features/predictions/routes/PredictPage';
import InsightsPage from '../features/insights/routes/InsightsPage';
import HistoryPage from '../features/history/routes/HistoryPage';
import AnalyticsPage from '../features/analytics/routes/AnalyticsPage';
import ReportsPage from '../features/reports/routes/ReportsPage';
import SettingsPage from '../features/settings/routes/SettingsPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="predict" element={<PredictPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="insights" element={<InsightsPage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
