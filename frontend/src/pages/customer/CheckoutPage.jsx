import { useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';

const topDrivers = [
  { id: 'driver-1', name: 'Grace N.', rating: 4.95 },
  { id: 'driver-2', name: 'Samuel B.', rating: 4.90 },
  { id: 'driver-3', name: 'Lydia P.', rating: 4.88 }
];

function CheckoutPage () {
  const [showName, setShowName] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState(null);

  return (
    <PageLayout
      title="Checkout"
      description="Enter delivery information, privacy preferences, and optionally reserve a specific driver."
    >
      <div className="card">
        <h3>Delivery details</h3>
        <label>
          Address
          <input type="text" placeholder="Plot 4, Kira Road" />
        </label>
        <label>
          Contact phone
          <input type="text" placeholder="0700 123 456" />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={showName} onChange={(event) => setShowName(event.target.checked)} />
          <span>Show my name to vendor</span>
        </label>
      </div>

      <div className="card">
        <h3>Top drivers for this vendor</h3>
        <div className="grid grid--drivers">
          {topDrivers.map((driver) => (
            <button
              key={driver.id}
              type="button"
              className={selectedDriver === driver.id ? 'driver-chip driver-chip--active' : 'driver-chip'}
              onClick={() => setSelectedDriver(driver.id)}
            >
              <strong>{driver.name}</strong>
              <span>{driver.rating} ★</span>
            </button>
          ))}
        </div>
        <p className="muted">Want to browse everyone? Use the “See more drivers” action from the restaurant page.</p>
      </div>

      <div className="card">
        <h3>Summary</h3>
        <ul>
          <li>Driver payout suggestion: UGX 7,000</li>
          <li>Privacy: {showName ? 'Full name shared' : 'Anonymous alias assigned'}</li>
          <li>Driver selection: {selectedDriver || 'Auto assign'}</li>
        </ul>
        <button className="button" type="button">Place order</button>
      </div>
    </PageLayout>
  );
}

export default CheckoutPage;
