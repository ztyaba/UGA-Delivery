import { useEffect, useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { getApprovedDrivers } from '../../api/vendors.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

function VendorApprovedDriversPage () {
  const { role, user } = useDemoAuth();
  const [drivers, setDrivers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (role !== 'vendor') {
      setMessage('Switch to vendor role to view approved drivers.');
      return;
    }
    getApprovedDrivers(user.id)
      .then(({ drivers: response }) => {
        setDrivers(response);
        setMessage('');
      })
      .catch((error) => setMessage(error.message));
  }, [user.id, role]);

  return (
    <PageLayout
      title="Approved drivers"
      description="Full roster of drivers cleared to accept jobs for this vendor."
    >
      {message && <p className="error-text">{message}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Deliveries</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td>{driver.profile?.fullName || driver.name}</td>
              <td>{driver.rating?.toFixed?.(2) || driver.rating || '—'}</td>
              <td>{driver.deliveriesCompleted || 0}</td>
            </tr>
          ))}
          {!drivers.length && (
            <tr>
              <td colSpan={3} className="muted">No drivers approved yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </PageLayout>
  );
}

export default VendorApprovedDriversPage;
