import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { assignOrder, listOrders } from '../../api/orders.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

function DriverJobsPage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [message, setMessage] = useState('');

  const loadJobs = () => {
    if (role !== 'driver') {
      setMessage('Switch to the driver role to manage jobs.');
      setAvailableJobs([]);
      setActiveOrders([]);
      return;
    }
    listOrders(auth, { view: 'available' })
      .then(({ orders }) => {
        setAvailableJobs(orders);
        setMessage('');
      })
      .catch((err) => setMessage(err.message));
    listOrders(auth, { view: 'active' })
      .then(({ orders }) => setActiveOrders(orders))
      .catch(() => {});
  };

  useEffect(() => {
    loadJobs();
  }, [role, auth]);

  const handleAccept = async (orderId) => {
    try {
      await assignOrder(auth, orderId, { driverId: user.id });
      loadJobs();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <PageLayout
      title="Delivery jobs"
      description="View open deliveries filtered by approved vendors. Accepting an order locks it atomically."
      actions={<button className="button button--ghost" type="button" onClick={loadJobs}>Refresh</button>}
    >
      {message && <p className="error-text">{message}</p>}
      <div className="card">
        <h3>Available jobs</h3>
        {availableJobs.map((job) => (
          <div key={job._id} className="job-row">
            <div>
              <strong>{job.vendorId}</strong>
              <p className="muted">Driver payout UGX {job.driverPayout}</p>
            </div>
            <button className="button button--ghost" type="button" onClick={() => handleAccept(job._id)}>
              Accept
            </button>
          </div>
        ))}
        {!availableJobs.length && <p className="muted">No open jobs at the moment.</p>}
      </div>

      <div className="card">
        <h3>Active deliveries</h3>
        {activeOrders.map((order) => (
          <div key={order._id} className="job-row">
            <div>
              <strong>{order.vendorId}</strong>
              <p className="muted">Status: {order.status}</p>
              {order.customerSelectedDriver === user.id && <p className="badge">Customer specifically selected you</p>}
            </div>
            <Link className="button" to={`/driver/orders/${order._id}`}>Manage</Link>
          </div>
        ))}
        {!activeOrders.length && <p className="muted">You have no active deliveries.</p>}
      </div>
    </PageLayout>
  );
}

export default DriverJobsPage;
