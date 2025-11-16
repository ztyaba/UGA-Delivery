import VendorDashboardPage from '../pages/vendor/VendorDashboardPage.jsx';
import VendorOrderDetailPage from '../pages/vendor/VendorOrderDetailPage.jsx';
import VendorApplicationsPage from '../pages/vendor/VendorApplicationsPage.jsx';
import VendorApprovedDriversPage from '../pages/vendor/VendorApprovedDriversPage.jsx';

const vendorRoutes = [
  { path: '/vendor/dashboard', element: <VendorDashboardPage /> },
  { path: '/vendor/orders/:orderId', element: <VendorOrderDetailPage /> },
  { path: '/vendor/applications', element: <VendorApplicationsPage /> },
  { path: '/vendor/approved-drivers', element: <VendorApprovedDriversPage /> }
];

export default vendorRoutes;
