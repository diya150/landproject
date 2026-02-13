import { createBrowserRouter } from 'react-router';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Plots } from './pages/Plots';
import { PlotDetail } from './pages/PlotDetail';
import { Violations } from './pages/Violations';
import { ChangeDetection } from './pages/ChangeDetection';
import { Reports } from './pages/Reports';
import { Alerts } from './pages/Alerts';
import { IndustriesRegistry } from './pages/IndustriesRegistry';
import { DashboardLayout } from './components/layout/DashboardLayout';
import LandMonitoringDashboard from './pages/LandMonitoringDashboard';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: LandingPage,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'land-monitoring',
        Component: LandMonitoringDashboard,
      },
      {
        path: 'plots',
        Component: Plots,
      },
      {
        path: 'plots/:id',
        Component: PlotDetail,
      },
      {
        path: 'violations',
        Component: Violations,
      },
      {
        path: 'change-detection',
        Component: ChangeDetection,
      },
      {
        path: 'reports',
        Component: Reports,
      },
      {
        path: 'alerts',
        Component: Alerts,
      },
      {
        path: 'settings',
        Component: Dashboard, // Placeholder
      },
      {
        path: 'industries-registry',
        Component: IndustriesRegistry,
      },
    ],
  },
]);