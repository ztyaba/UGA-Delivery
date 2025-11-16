import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { getVendor, getApprovedDrivers } from '../../api/vendors.js';
import { getCustomerProfile } from '../../api/customers.js';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';

const menu = [
  { id: 'item-1', name: 'Luwombo Platter', price: 'UGX 28,000', description: 'Banana leaf steamed chicken, matoke, and greens.' },
  { id: 'item-2', name: 'Rolex Supreme', price: 'UGX 12,000', description: 'Trio of chapati wraps with eggs, veggies, and sauces.' },
  { id: 'item-3', name: 'Millet Bowl', price: 'UGX 18,500', description: 'Smoky beans, millet bread, avocado, and chili oil.' }
];

function RestaurantPage () {
  const { vendorId } = useParams();
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [vendor, setVendor] = useState(null);
  const [drivers, setDrivers] = useState([]);
  const [favoriteDrivers, setFavoriteDrivers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    getVendor(vendorId)
      .then(({ vendor: vendorResponse }) => {
        if (isMounted) {
          setVendor(vendorResponse);
          setError('');
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message);
      });
    getApprovedDrivers(vendorId, { limit: 5 })
      .then(({ drivers: driverList }) => {
        if (isMounted) setDrivers(driverList);
      })
      .catch(() => {});

    if (role === 'customer') {
      getCustomerProfile(auth, user.id)
        .then(({ customer }) => {
          if (isMounted) setFavoriteDrivers(customer.favoriteDrivers || []);
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, [vendorId, auth, role, user.id]);

  const badgeDriver = useMemo(() => {
    if (!drivers.length || !favoriteDrivers.length) return null;
    const favoriteIds = favoriteDrivers.map((driver) => (driver._id || driver.id || driver).toString());
    const overlapping = drivers.filter((driver) => favoriteIds.includes(driver._id?.toString() || driver.id));
    if (!overlapping.length) return null;
    return overlapping.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
  }, [drivers, favoriteDrivers]);

  return (
    <PageLayout
      title={vendor ? vendor.name : 'Restaurant view'}
      description="Menu preview with privacy badge and quick link to the driver directory."
      actions={<Link className="button button--secondary" to={`/restaurant/${vendorId}/drivers`}>See more drivers</Link>}
    >
      {error && <p className="error-text">{error}</p>}
      {badgeDriver && (
        <div className="info-banner">
          <strong>{badgeDriver.profile?.fullName || badgeDriver.name}</strong> delivers here ✓
        </div>
      )}

      <div className="grid">
        {menu.map((item) => (
          <article key={item.id} className="card">
            <header>
              <h3>{item.name}</h3>
              <span className="badge">{item.price}</span>
            </header>
            <p className="muted">{item.description}</p>
            <button className="button button--ghost" type="button">Add to cart</button>
          </article>
        ))}
      </div>

      <div className="card">
        <h3>Ready to checkout?</h3>
        <p>Preview the checkout experience with privacy toggle, driver selection, and payout summary.</p>
        <Link className="button" to={`/checkout?vendorId=${vendorId}`}>Go to checkout</Link>
      </div>
    </PageLayout>
  );
}

export default RestaurantPage;
