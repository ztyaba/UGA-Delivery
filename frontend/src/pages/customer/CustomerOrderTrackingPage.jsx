import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { getOrder } from '../../api/orders.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';
import useSocketRoom from '../../hooks/useSocketRoom.js';

const steps = ['Pending', 'Preparing', 'Ready for Pickup', 'On the Way', 'Delivered'];

function CustomerOrderTrackingPage () {
  const { orderId } = useParams();
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role !== 'customer') {
      setError('Switch to the customer role to track this order.');
      return;
    }
    getOrder(auth, orderId)
      .then(({ order: response }) => {
        setOrder(response);
        setError('');
      })
      .catch((err) => setError(err.message));
  }, [orderId, auth, role]);

  const handleRealtimeUpdate = useCallback((payload) => {
    setOrder((prev) => (prev ? { ...prev, ...payload } : prev));
  }, []);

  const handlePayout = useCallback((payload) => {
    setOrder((prev) => (prev ? { ...prev, isPaid: true, paidAt: payload.paidAt } : prev));
  }, []);

  useSocketRoom(order ? `order:${order._id}` : null, useMemo(() => ({
    'order:confirmed': handleRealtimeUpdate,
    'order:ready': handleRealtimeUpdate,
    'order:accepted': handleRealtimeUpdate,
    'order:pickedup': handleRealtimeUpdate,
    'order:delivered': handleRealtimeUpdate,
    'payout:completed': handlePayout
  }), [handleRealtimeUpdate, handlePayout, order ? order._id : null]));

  const completedIndex = order ? steps.indexOf(order.status) : -1;

  return (
    <PageLayout
      title={`Order tracker: ${orderId}`}
      description="Each state updates via Socket.IO to keep customers, drivers, and vendors aligned."
    >
      {error && <p className="error-text">{error}</p>}
      <ol className="tracker">
        {steps.map((step, index) => (
          <li key={step} className={index <= completedIndex ? 'tracker-step tracker-step--complete' : 'tracker-step'}>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="card">
        <h3>Driver details</h3>
        <p>Assigned driver: {order?.assignedDriver || 'Not yet assigned'}</p>
        <p>Customer selected driver: {order?.customerSelectedDriver ? 'Yes' : 'No'}</p>
        <p>Delivery photo uploaded: {order?.deliveryPhotoUrl ? 'Yes' : 'No'}</p>
        <p>Payout status: {order?.isPaid ? `Paid at ${new Date(order.paidAt).toLocaleString()}` : 'Waiting for vendor action or auto-pay'}</p>
      </div>
    </PageLayout>
  );
}

export default CustomerOrderTrackingPage;
