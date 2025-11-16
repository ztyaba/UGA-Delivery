import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';
import { demoVendors } from '../../config/demoUsers.js';

function HomePage () {
  return (
    <PageLayout
      title="Discover restaurants"
      description="Browse curated vendors, favorite your go-to drivers, and jump into the checkout experience."
    >
      <div className="grid">
        {demoVendors.map((vendor) => (
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
