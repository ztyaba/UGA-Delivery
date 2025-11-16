import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { listOrders } from '../../api/orders.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

function CustomerOrdersPage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  const loadOrders = () => {
    if (role !== 'customer') {
      setError('Switch to the customer role to view orders.');
      setOrders([]);
      return;
    }
    listOrders(auth, { limit: 10 })
      .then(({ orders: response }) => {
        setOrders(response);
        setError('');
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    loadOrders();
  }, [role, auth]);

  return (
    <PageLayout
      title="My orders"
      description="Track each order status in realtime."
      actions={<button className="button button--ghost" type="button" onClick={loadOrders}>Refresh</button>}
    >
      {error && <p className="error-text">{error}</p>}
      <div className="timeline">
        {orders.map((order) => (
          <article key={order._id} className="card timeline-item">
            <header>
              <div>
                <h3>{order.vendorId}</h3>
                <p className="muted">Order {order._id}</p>
              </div>
              <span className="badge">{order.status}</span>
            </header>
            <p>Driver: {order.assignedDriver || 'Unassigned'}</p>
            <p className="muted">Created at {new Date(order.createdAt).toLocaleString()}</p>
            <Link className="button button--ghost" to={`/customer/orders/${order._id}`}>Open tracker</Link>
          </article>
        ))}
        {!orders.length && !error && role === 'customer' && (
          <p className="muted">No orders yet. Place one from the checkout experience.</p>
        )}
      </div>
    </PageLayout>
  );
}

export default CustomerOrdersPage;
