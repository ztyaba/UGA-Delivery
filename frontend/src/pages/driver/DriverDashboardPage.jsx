import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { getDriverProfile } from '../../api/drivers.js';
import { listOrders } from '../../api/orders.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

function DriverDashboardPage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [profile, setProfile] = useState(null);
  const [activeOrders, setActiveOrders] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (role !== 'driver') {
      setMessage('Switch to driver role to view the dashboard.');
      return;
    }
    getDriverProfile(auth, user.id)
      .then(({ driver }) => {
        setProfile(driver);
        setMessage('');
      })
      .catch((err) => setMessage(err.message));
    listOrders(auth, { view: 'active' })
      .then(({ orders }) => setActiveOrders(orders))
      .catch(() => {});
  }, [auth, role, user.id]);

  const summary = [
    { label: 'Verification status', value: profile?.profile?.verifiedStatus || 'Unknown' },
    { label: 'Approved vendors', value: profile?.profile?.approvedVendors?.length || 0 },
    { label: 'Deliveries completed', value: profile?.deliveriesCompleted || 0 }
  ];

  return (
    <PageLayout
      title="Driver dashboard"
      description="Monitor verification, availability, open jobs, and payouts in one place."
      actions={<Link className="button button--secondary" to="/driver/jobs">View jobs</Link>}
    >
      {message && <p className="error-text">{message}</p>}
      <div className="grid">
        {summary.map((item) => (
          <article key={item.label} className="card">
            <h3>{item.label}</h3>
            <p className="stat-value">{item.value}</p>
          </article>
        ))}
      </div>
      <div className="card">
        <h3>Active order highlight</h3>
        {activeOrders.map((order) => (
          <p key={order._id}>Order {order._id}: {order.status}</p>
        ))}
        {!activeOrders.length && <p>No active deliveries right now. Go online to receive real-time offers.</p>}
      </div>
    </PageLayout>
  );
}

export default DriverDashboardPage;
