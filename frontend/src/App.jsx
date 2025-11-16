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
import { useState } from 'react';

function App () {
  const [message] = useState('Uganda Food Delivery Platform');

  return (
    <div className="app-shell">
      <header>
        <h1>{message}</h1>
        <p>Stage 1 setup complete. Future stages will bring full functionality.</p>
      </header>
      <section>
        <p>
          Backend base API is reachable at <code>/api/health</code>. Frontend routing and detailed pages
          will be implemented in later stages.
        </p>
      </section>
    </div>
  );
}

export default App;
