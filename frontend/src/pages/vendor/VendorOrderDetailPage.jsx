import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';
import {
  approveDeliveryPhoto,
  confirmOrder,
  getOrder,
  markReady,
  payDriver,
  rejectDeliveryPhoto
} from '../../api/orders.js';

function VendorOrderDetailPage () {
  const { orderId } = useParams();
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [order, setOrder] = useState(null);
  const [payout, setPayout] = useState(0);
  const [rejectNote, setRejectNote] = useState('');
  const [message, setMessage] = useState('');

  const loadOrder = () => {
    if (role !== 'vendor') {
      setMessage('Switch to vendor role to manage orders.');
      return;
    }
    getOrder(auth, orderId)
      .then(({ order: response }) => {
        setOrder(response);
        setPayout(response.driverPayout || 0);
        setMessage('');
      })
      .catch((err) => setMessage(err.message));
  };

  useEffect(() => {
    loadOrder();
  }, [orderId, role, auth]);

  const handleConfirm = async () => {
    try {
      await confirmOrder(auth, orderId, { driverPayout: Number(payout) });
      loadOrder();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleReady = async () => {
    try {
      await markReady(auth, orderId);
      loadOrder();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleApprove = async () => {
    try {
      await approveDeliveryPhoto(auth, orderId);
      loadOrder();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleReject = async () => {
    if (!rejectNote) {
      setMessage('Provide a rejection note to guide the driver.');
      return;
    }
    try {
      await rejectDeliveryPhoto(auth, orderId, { note: rejectNote });
      setRejectNote('');
      loadOrder();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handlePay = async () => {
    try {
      await payDriver(auth, orderId);
      loadOrder();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <PageLayout
      title={`Vendor order detail: ${orderId}`}
      description="Adjust payout, approve proof-of-delivery photos, or trigger manual payments."
      actions={<button className="button button--ghost" type="button" onClick={loadOrder}>Refresh</button>}
    >
      {message && <p className="error-text">{message}</p>}
      <div className="card">
        <h3>Customer information</h3>
        <p className="muted">Privacy-aware label: {order?.customerShowsName ? order?.customerId : `Customer #${order?.anonymousOrderNumber || '?'}`}</p>
        <p>Delivery address: {order?.deliveryAddress}</p>
        <p>Contact phone: {order?.contactPhone}</p>
      </div>

      <div className="card">
        <h3>Driver payout</h3>
        <label>
          Amount (UGX)
          <input type="number" value={payout} onChange={(event) => setPayout(event.target.value)} />
        </label>
        <div className="card-actions">
          <button className="button button--ghost" type="button" onClick={handleConfirm}>Confirm order</button>
          <button className="button" type="button" onClick={handleReady}>Mark ready</button>
        </div>
      </div>

      <div className="card">
        <h3>Delivery photo review</h3>
        {order?.deliveryPhotoUrl ? (
          <img src={order.deliveryPhotoUrl} alt="Delivery proof" className="delivery-photo" />
        ) : (
          <p className="muted">No photo uploaded yet.</p>
        )}
        <label>
          Rejection note
          <textarea value={rejectNote} onChange={(event) => setRejectNote(event.target.value)} rows={3} />
        </label>
        <div className="card-actions">
          <button className="button button--ghost" type="button" onClick={handleReject}>Reject photo</button>
          <button className="button" type="button" onClick={handleApprove}>Approve photo</button>
          <button className="button button--secondary" type="button" onClick={handlePay}>Pay driver now</button>
        </div>
        <p className="muted">Auto-pay occurs if no action is taken within 5 minutes.</p>
      </div>
    </PageLayout>
  );
}

export default VendorOrderDetailPage;
