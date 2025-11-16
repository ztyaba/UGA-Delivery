import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';
import { getVendor } from '../../api/vendors.js';
import { listOrders } from '../../api/orders.js';

function VendorDashboardPage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [vendor, setVendor] = useState(null);
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (role !== 'vendor') {
      setMessage('Switch to vendor role to manage the dashboard.');
      return;
    }
    getVendor(user.id)
      .then(({ vendor: response }) => {
        setVendor(response);
        setMessage('');
      })
      .catch((err) => setMessage(err.message));
    listOrders(auth, { limit: 5 })
      .then(({ orders: response }) => setOrders(response))
      .catch(() => {});
  }, [auth, role, user.id]);

  const panels = [
    { title: 'Pending orders', value: orders.filter((order) => order.status === 'Pending').length },
    { title: 'Ready for pickup', value: orders.filter((order) => order.status === 'Ready for Pickup').length },
    { title: 'Driver applications', value: vendor?.pendingDriverApplications?.length || 0 }
  ];

  const latestOrder = orders[0];

  return (
    <PageLayout
      title="Vendor dashboard"
      description="Oversee customer privacy, payouts, and driver verification in a single hub."
      actions={<Link className="button button--secondary" to="/vendor/applications">Review applications</Link>}
    >
      {message && <p className="error-text">{message}</p>}
      <div className="grid">
        {panels.map((panel) => (
          <article key={panel.title} className="card">
            <h3>{panel.title}</h3>
            <p className="stat-value">{panel.value}</p>
          </article>
        ))}
      </div>
      <div className="card">
        <h3>Live orders</h3>
        <p>Incoming orders show anonymous labels when customers hide their identity. Use the detail view to confirm payouts.</p>
        {latestOrder ? (
          <Link className="button" to={`/vendor/orders/${latestOrder._id}`}>Open latest order</Link>
        ) : (
          <p className="muted">No recent orders.</p>
        )}
      </div>
    </PageLayout>
  );
}

export default VendorDashboardPage;
