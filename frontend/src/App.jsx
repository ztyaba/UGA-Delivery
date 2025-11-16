import { useMemo } from 'react';
import { useRoutes } from 'react-router-dom';
import SiteHeader from './components/SiteHeader.jsx';
import PageLayout from './components/PageLayout.jsx';
import customerRoutes from './routes/CustomerRoutes.jsx';
import driverRoutes from './routes/DriverRoutes.jsx';
import vendorRoutes from './routes/VendorRoutes.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

function App () {
  const routes = useMemo(() => ([
    ...customerRoutes,
    ...driverRoutes,
    ...vendorRoutes,
    { path: '*', element: <NotFoundPage /> }
  ]), []);

  const routing = useRoutes(routes);

  return (
    <div className="app-shell">
      <SiteHeader />
      <main className="app-main">
        {routing || (
          <PageLayout title="Loading" description="Preparing routes..." />
        )}
      </main>
    </div>
  );
}

export default App;
