import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';
import { getDriverProfile, selectVendors } from '../../api/drivers.js';
import { demoVendors } from '../../config/demoUsers.js';

function DriverVendorsPage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [approvedVendors, setApprovedVendors] = useState([]);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (role !== 'driver') {
      setMessage('Switch to driver role to edit visibility.');
      return;
    }
    getDriverProfile(auth, user.id)
      .then(({ driver }) => {
        const approvedIds = (driver.profile?.approvedVendors || []).map((vendor) => vendor.toString());
        setApprovedVendors(approvedIds);
        setSelectedIds(new Set((driver.profile?.deliverForVendors || []).map((vendor) => vendor.toString())));
        setMessage('');
      })
      .catch((error) => setMessage(error.message));
  }, [auth, role, user.id]);

  const handleToggle = (vendorId) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(vendorId)) {
        next.delete(vendorId);
      } else {
        next.add(vendorId);
      }
      return next;
    });
  };

  const handleSave = async () => {
    try {
      await selectVendors(auth, user.id, { vendorIds: Array.from(selectedIds) });
      setMessage('Updated profile visibility.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const approvedVendorDetails = demoVendors.filter((vendor) => approvedVendors.includes(vendor.id));

  return (
    <PageLayout
      title="Vendors I deliver for"
      description="Pick which approved vendors appear on your public profile and job filters."
      actions={<button className="button button--ghost" type="button" onClick={handleSave}>Save visibility</button>}
    >
      {message && <p className="info-text">{message}</p>}
      <div className="card">
        {approvedVendorDetails.length === 0 && <p className="muted">No vendor approvals yet.</p>}
        {approvedVendorDetails.map((vendor) => (
          <label key={vendor.id} className="checkbox-row">
            <input
              type="checkbox"
              checked={selectedIds.has(vendor.id)}
              onChange={() => handleToggle(vendor.id)}
            />
            <span>{vendor.name}</span>
          </label>
        ))}
      </div>
    </PageLayout>
  );
}

export default DriverVendorsPage;
