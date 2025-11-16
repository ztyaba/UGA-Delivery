import HomePage from '../pages/customer/HomePage.jsx';
import RestaurantPage from '../pages/customer/RestaurantPage.jsx';
import RestaurantDriversPage from '../pages/customer/RestaurantDriversPage.jsx';
import CheckoutPage from '../pages/customer/CheckoutPage.jsx';
import CustomerOrdersPage from '../pages/customer/CustomerOrdersPage.jsx';
import CustomerFavoritesPage from '../pages/customer/CustomerFavoritesPage.jsx';
import CustomerOrderTrackingPage from '../pages/customer/CustomerOrderTrackingPage.jsx';

const customerRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/restaurant/:vendorId', element: <RestaurantPage /> },
  { path: '/restaurant/:vendorId/drivers', element: <RestaurantDriversPage /> },
  { path: '/checkout', element: <CheckoutPage /> },
  { path: '/customer/orders', element: <CustomerOrdersPage /> },
  { path: '/customer/orders/:orderId', element: <CustomerOrderTrackingPage /> },
  { path: '/customer/favorites', element: <CustomerFavoritesPage /> }
];

export default customerRoutes;
