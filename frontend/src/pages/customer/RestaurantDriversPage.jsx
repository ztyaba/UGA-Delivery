import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { getApprovedDrivers } from '../../api/vendors.js';
import { addFavoriteDriver, getCustomerProfile, removeFavoriteDriver } from '../../api/customers.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

function RestaurantDriversPage () {
  const { vendorId } = useParams();
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [drivers, setDrivers] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [message, setMessage] = useState('');

  const loadDrivers = (page = 1) => {
    getApprovedDrivers(vendorId, { page })
      .then(({ drivers: responseDrivers, page: currentPage, totalPages }) => {
        setDrivers(responseDrivers);
        setPageInfo({ page: currentPage, totalPages });
        setMessage('');
      })
      .catch((err) => setMessage(err.message));
  };

  useEffect(() => {
    loadDrivers();
  }, [vendorId]);

  useEffect(() => {
    if (role !== 'customer') return;
    getCustomerProfile(auth, user.id)
      .then(({ customer }) => {
        setFavoriteIds(new Set((customer.favoriteDrivers || []).map((driver) => (driver._id || driver).toString())));
      })
      .catch(() => {});
  }, [auth, role, user.id]);

  const handleFavoriteToggle = async (driverId) => {
    if (role !== 'customer') {
      setMessage('Switch to customer role to manage favorites.');
      return;
    }
    try {
      if (favoriteIds.has(driverId)) {
        await removeFavoriteDriver(auth, user.id, driverId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.delete(driverId);
          return next;
        });
      } else {
        await addFavoriteDriver(auth, user.id, driverId);
        setFavoriteIds((prev) => {
          const next = new Set(prev);
          next.add(driverId);
          return next;
        });
      }
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <PageLayout
      title="Approved drivers"
      description="Browse every driver that can serve this vendor."
      actions={<Link className="button button--secondary" to={`/restaurant/${vendorId}`}>Back to menu</Link>}
    >
      {message && <p className="error-text">{message}</p>}
      <div className="grid">
        {drivers.map((driver) => {
          const driverId = driver._id?.toString() || driver.id;
          const isFavorite = favoriteIds.has(driverId);
          return (
            <article key={driverId} className="card">
              <header>
                <h3>{driver.profile?.fullName || driver.name}</h3>
                <p className="muted">Rating {driver.rating?.toFixed?.(2) || driver.rating || '—'} · {driver.deliveriesCompleted ?? driver.deliveries ?? 0} deliveries</p>
              </header>
              <div className="card-actions">
                <button
                  className="button button--ghost"
                  type="button"
                  onClick={() => handleFavoriteToggle(driverId)}
                >
                  {isFavorite ? 'Unfavorite' : 'Favorite'}
                </button>
                <Link className="button" to={`/checkout?vendorId=${vendorId}&driverId=${driverId}`}>
                  Select driver
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <div className="pagination">
        <button
          className="button button--ghost"
          type="button"
          disabled={pageInfo.page <= 1}
          onClick={() => loadDrivers(pageInfo.page - 1)}
        >
          Previous
        </button>
        <span>Page {pageInfo.page} of {pageInfo.totalPages}</span>
        <button
          className="button button--ghost"
          type="button"
          disabled={pageInfo.page >= pageInfo.totalPages}
          onClick={() => loadDrivers(pageInfo.page + 1)}
        >
          Next
        </button>
      </div>
    </PageLayout>
  );
}

export default RestaurantDriversPage;
