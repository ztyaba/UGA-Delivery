import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { getOrder, markDelivered, markPickedUp } from '../../api/orders.js';
import { uploadDeliveryPhoto } from '../../api/uploads.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

function DriverOrderDetailPage () {
  const { orderId } = useParams();
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [order, setOrder] = useState(null);
  const [message, setMessage] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadOrder = () => {
    if (role !== 'driver') {
      setMessage('Switch to driver role to manage orders.');
      return;
    }
    getOrder(auth, orderId)
      .then(({ order: response }) => {
        setOrder(response);
        setMessage('');
      })
      .catch((err) => setMessage(err.message));
  };

  useEffect(() => {
    loadOrder();
  }, [orderId, role, auth]);

  const handlePickup = async () => {
    try {
      await markPickedUp(auth, orderId);
      loadOrder();
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelivery = async () => {
    if (!photoFile) {
      setMessage('Please select a photo before submitting.');
      return;
    }
    setIsSubmitting(true);
    try {
      const upload = await uploadDeliveryPhoto(auth, photoFile);
      await markDelivered(auth, orderId, { deliveryPhotoUrl: upload.url });
      setPhotoFile(null);
      loadOrder();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title={`Manage order ${orderId}`}
      description="Upload delivery photos, view pickup notes, and finalize payout submissions."
      actions={<button className="button button--ghost" type="button" onClick={loadOrder}>Refresh</button>}
    >
      {message && <p className="error-text">{message}</p>}
      <div className="card">
        <h3>Pickup checklist</h3>
        <ul>
          <li>Vendor: {order?.vendorId}</li>
          <li>Customer address: {order?.deliveryAddress}</li>
          <li>Contact phone: {order?.contactPhone}</li>
        </ul>
        <button className="button button--ghost" type="button" onClick={handlePickup} disabled={order?.pickedUpAt}>
          {order?.pickedUpAt ? 'Picked up' : 'Mark picked up'}
        </button>
      </div>

      <div className="card">
        <h3>Delivery proof</h3>
        {order?.deliveryPhotoRejectNote && (
          <p className="error-text">Vendor note: {order.deliveryPhotoRejectNote}</p>
        )}
        <p>Upload a clear photo of the delivery location. Vendors can approve or reject with notes.</p>
        <label className="upload-input">
          <input type="file" accept="image/*" onChange={(event) => setPhotoFile(event.target.files[0])} />
          <span>{photoFile ? photoFile.name : 'Upload delivery photo'}</span>
        </label>
        <button className="button" type="button" onClick={handleDelivery} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Submit delivery'}
        </button>
        <p className="muted">Auto-pay triggers 5 minutes after submission if the vendor takes no action.</p>
      </div>
    </PageLayout>
  );
}

export default DriverOrderDetailPage;
