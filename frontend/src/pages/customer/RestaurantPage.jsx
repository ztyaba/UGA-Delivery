import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const menu = [
  { id: 'item-1', name: 'Luwombo Platter', price: 'UGX 28,000', description: 'Banana leaf steamed chicken, matoke, and greens.' },
  { id: 'item-2', name: 'Rolex Supreme', price: 'UGX 12,000', description: 'Trio of chapati wraps with eggs, veggies, and sauces.' },
  { id: 'item-3', name: 'Millet Bowl', price: 'UGX 18,500', description: 'Smoky beans, millet bread, avocado, and chili oil.' }
];

const sampleFavorites = [{ id: 'driver-11', name: 'Aisha K.', vendorMatch: true }];

function RestaurantPage () {
  const { vendorId } = useParams();
  const favoriteBadge = sampleFavorites.find((fav) => fav.vendorMatch);

  return (
    <PageLayout
      title={`Restaurant view: ${vendorId}`}
      description="Menu preview with privacy badge and quick link to the driver directory."
      actions={<Link className="button button--secondary" to={`/restaurant/${vendorId}/drivers`}>See more drivers</Link>}
    >
      {favoriteBadge && (
        <div className="info-banner">
          <strong>{favoriteBadge.name}</strong> delivers here ✓
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
        <Link className="button" to="/checkout">Go to checkout</Link>
      </div>
    </PageLayout>
  );
}

export default RestaurantPage;
