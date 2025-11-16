import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { getCustomerProfile, removeFavoriteDriver } from '../../api/customers.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

function CustomerFavoritesPage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState('');

  const loadFavorites = () => {
    if (role !== 'customer') {
      setMessage('Switch to the customer role to view favorites.');
      return;
    }
    getCustomerProfile(auth, user.id)
      .then(({ customer }) => {
        setFavorites(customer.favoriteDrivers || []);
        setMessage('');
      })
      .catch((error) => setMessage(error.message));
  };

  useEffect(() => {
    loadFavorites();
  }, [role, auth, user.id]);

  const handleRemove = async (driverId) => {
    try {
      await removeFavoriteDriver(auth, user.id, driverId);
      setFavorites((prev) => prev.filter((driver) => (driver._id || driver.id).toString() !== driverId));
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <PageLayout
      title="Favorite drivers"
      description="Drivers saved here appear first in checkout and show vendor-specific badges."
    >
      {message && <p className="error-text">{message}</p>}
      <div className="grid">
        {favorites.map((driver) => {
          const driverId = (driver._id || driver.id).toString();
          return (
            <article key={driverId} className="card">
              <header>
                <h3>{driver.profile?.fullName || driver.name}</h3>
                <p className="muted">Rating {driver.rating?.toFixed?.(2) || driver.rating || '—'}</p>
              </header>
              <p className="muted">Approved vendors: {(driver.profile?.approvedVendors || []).length}</p>
              <div className="card-actions">
                <button className="button button--ghost" type="button" onClick={() => handleRemove(driverId)}>
                  Remove favorite
                </button>
              </div>
            </article>
          );
        })}
        {!favorites.length && role === 'customer' && (
          <p className="muted">No favorite drivers yet. Visit a vendor&apos;s driver list to add one.</p>
        )}
      </div>
    </PageLayout>
  );
}

export default CustomerFavoritesPage;
