import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';
import { approveDriver, getVendor, inviteDriver, rejectDriver } from '../../api/vendors.js';

function VendorApplicationsPage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [applications, setApplications] = useState([]);
  const [message, setMessage] = useState('');

  const loadApplications = () => {
    if (role !== 'vendor') {
      setMessage('Switch to vendor role to review applications.');
      return;
    }
    getVendor(user.id)
      .then(({ vendor }) => {
        setApplications(vendor.pendingDriverApplications || []);
        setMessage('');
      })
      .catch((error) => setMessage(error.message));
  };

  useEffect(() => {
    loadApplications();
  }, [role, auth, user.id]);

  const handleAction = async (appId, action) => {
    try {
      if (action === 'invite') {
        await inviteDriver(auth, user.id, appId);
      } else if (action === 'approve') {
        await approveDriver(auth, user.id, appId);
      } else if (action === 'reject') {
        await rejectDriver(auth, user.id, appId);
      }
      loadApplications();
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <PageLayout
      title="Driver applications"
      description="Review ID + selfie submissions, invite drivers for verification, and approve once satisfied."
      actions={<button className="button button--ghost" type="button" onClick={loadApplications}>Refresh</button>}
    >
      {message && <p className="error-text">{message}</p>}
      <div className="grid">
        {applications.map((application) => (
          <article key={application._id} className="card">
            <header>
              <h3>Driver {application.driverId}</h3>
              <p className="muted">{application.phone}</p>
            </header>
            <p className="muted">Applied at {new Date(application.appliedAt).toLocaleString()}</p>
            <div className="card-actions">
              <button className="button button--ghost" type="button" onClick={() => handleAction(application._id, 'invite')}>
                Invite
              </button>
              <button className="button" type="button" onClick={() => handleAction(application._id, 'approve')}>
                Approve
              </button>
              <button className="button button--secondary" type="button" onClick={() => handleAction(application._id, 'reject')}>
                Reject
              </button>
            </div>
          </article>
        ))}
        {!applications.length && <p className="muted">No pending applications.</p>}
      </div>
    </PageLayout>
  );
}

export default VendorApplicationsPage;
