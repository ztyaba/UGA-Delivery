import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const sampleVendors = [
  { id: 'vendor-001', name: 'Kampala Eats', cuisine: 'Ugandan Classics', eta: '30-40 min', badge: 'Matoke Bowls' },
  { id: 'vendor-002', name: 'Jinja Street Grill', cuisine: 'BBQ & Street Food', eta: '25-35 min', badge: 'Rolex wraps' },
  { id: 'vendor-003', name: 'Gulu Green Kitchen', cuisine: 'Vegetarian & Healthy', eta: '35-45 min', badge: 'Millet power' }
];

function HomePage () {
  return (
    <PageLayout
      title="Discover restaurants"
      description="Browse curated vendors, favorite your go-to drivers, and jump into the checkout experience."
    >
      <div className="grid">
        {sampleVendors.map((vendor) => (
          <article key={vendor.id} className="card">
            <header>
              <h3>{vendor.name}</h3>
              <p className="muted">{vendor.cuisine}</p>
            </header>
            <p className="badge">Featured: {vendor.badge}</p>
            <p className="muted">Est. delivery {vendor.eta}</p>
            <div className="card-actions">
              <Link className="button" to={`/restaurant/${vendor.id}`}>View menu</Link>
            </div>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}

export default HomePage;
