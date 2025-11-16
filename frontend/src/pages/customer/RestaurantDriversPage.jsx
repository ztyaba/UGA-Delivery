import { Link, useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const sampleDrivers = [
  { id: 'driver-21', name: 'Michael O.', rating: 4.9, deliveries: 210, status: 'Favorite' },
  { id: 'driver-22', name: 'Sarah T.', rating: 4.8, deliveries: 180, status: 'Available' },
  { id: 'driver-23', name: 'Brian L.', rating: 4.6, deliveries: 143, status: 'Popular' }
];

function RestaurantDriversPage () {
  const { vendorId } = useParams();
  return (
    <PageLayout
      title="Approved drivers"
      description="Browse every driver that can serve this vendor. Stage 6 will connect this list to live API data."
      actions={<Link className="button button--secondary" to={`/restaurant/${vendorId}`}>Back to menu</Link>}
    >
      <div className="grid">
        {sampleDrivers.map((driver) => (
          <article key={driver.id} className="card">
            <header>
              <h3>{driver.name}</h3>
              <p className="muted">Rating {driver.rating} · {driver.deliveries} deliveries</p>
            </header>
            <p className="badge">{driver.status}</p>
            <div className="card-actions">
              <button className="button button--ghost" type="button">Favorite</button>
              <Link className="button" to="/checkout">Select driver</Link>
            </div>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}

export default RestaurantDriversPage;
