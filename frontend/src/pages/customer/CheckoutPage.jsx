import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { getApprovedDrivers } from '../../api/vendors.js';
import { createOrder } from '../../api/orders.js';
import { defaultVendorId } from '../../config/demoUsers.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

const sampleItems = [
  { name: 'Rolex Supreme', quantity: 2, price: 12000 },
  { name: 'Millet Bowl', quantity: 1, price: 18500 }
];

function CheckoutPage () {
  const [searchParams] = useSearchParams();
  const vendorId = searchParams.get('vendorId') || defaultVendorId;
  const driverFromQuery = searchParams.get('driverId');
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [deliveryAddress, setDeliveryAddress] = useState('Plot 4, Kira Road');
  const [contactPhone, setContactPhone] = useState('0700 123 456');
  const [showName, setShowName] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(driverFromQuery);
  const [drivers, setDrivers] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getApprovedDrivers(vendorId, { limit: 5 })
      .then(({ drivers: driverList }) => setDrivers(driverList))
      .catch((error) => setStatusMessage(error.message));
  }, [vendorId]);

  const handleSubmit = async () => {
    if (role !== 'customer') {
      setStatusMessage('Switch to the customer role to place an order.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');
    try {
      const response = await createOrder(auth, {
        vendorId,
        items: sampleItems,
        deliveryAddress,
        contactPhone,
        customerShowsName: showName,
        customerSelectedDriver: selectedDriver,
        driverPayout: 7000
      });
      setStatusMessage(`Order ${response.order._id} created. Track it from the orders page.`);
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout
      title="Checkout"
      description="Enter delivery information, privacy preferences, and optionally reserve a specific driver."
    >
      {statusMessage && <p className="info-text">{statusMessage}</p>}
      <div className="card">
        <h3>Delivery details</h3>
        <label>
          Address
          <input type="text" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} />
        </label>
        <label>
          Contact phone
          <input type="text" value={contactPhone} onChange={(event) => setContactPhone(event.target.value)} />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={showName} onChange={(event) => setShowName(event.target.checked)} />
          <span>Show my name to vendor</span>
        </label>
      </div>

      <div className="card">
        <h3>Top drivers for this vendor</h3>
        <div className="grid grid--drivers">
          {drivers.map((driver) => {
            const driverId = driver._id?.toString() || driver.id;
            return (
              <button
                key={driverId}
                type="button"
                className={selectedDriver === driverId ? 'driver-chip driver-chip--active' : 'driver-chip'}
                onClick={() => setSelectedDriver(driverId)}
              >
                <strong>{driver.profile?.fullName || driver.name}</strong>
                <span>{driver.rating?.toFixed?.(2) || driver.rating || '—'} ★</span>
              </button>
            );
          })}
        </div>
        <p className="muted">Want to browse everyone? Use the “See more drivers” action from the restaurant page.</p>
      </div>

      <div className="card">
        <h3>Summary</h3>
        <ul>
          <li>Driver payout suggestion: UGX 7,000</li>
          <li>Privacy: {showName ? 'Full name shared' : 'Anonymous alias assigned'}</li>
          <li>Driver selection: {selectedDriver ? selectedDriver : 'Auto assign'}</li>
        </ul>
        <button className="button" type="button" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Placing order…' : 'Place order'}
        </button>
      </div>
    </PageLayout>
  );
}

export default CheckoutPage;
