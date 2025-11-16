import DriverDashboardPage from '../pages/driver/DriverDashboardPage.jsx';
import DriverProfilePage from '../pages/driver/DriverProfilePage.jsx';
import DriverVendorsPage from '../pages/driver/DriverVendorsPage.jsx';
import DriverJobsPage from '../pages/driver/DriverJobsPage.jsx';
import DriverOrderDetailPage from '../pages/driver/DriverOrderDetailPage.jsx';

const driverRoutes = [
  { path: '/driver/dashboard', element: <DriverDashboardPage /> },
  { path: '/driver/profile', element: <DriverProfilePage /> },
  { path: '/driver/vendors', element: <DriverVendorsPage /> },
  { path: '/driver/jobs', element: <DriverJobsPage /> },
  { path: '/driver/orders/:orderId', element: <DriverOrderDetailPage /> }
];

export default driverRoutes;
