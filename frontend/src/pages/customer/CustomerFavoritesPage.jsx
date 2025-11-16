import PageLayout from '../../components/PageLayout.jsx';

const favorites = [
  { id: 'driver-31', name: 'Nakku J.', vendors: ['Kampala Eats', 'Jinja Street Grill'], rating: 4.95 },
  { id: 'driver-32', name: 'Peter M.', vendors: ['Gulu Green Kitchen'], rating: 4.82 }
];

function CustomerFavoritesPage () {
  return (
    <PageLayout
      title="Favorite drivers"
      description="Drivers saved here appear first in checkout and show vendor-specific badges."
    >
      <div className="grid">
        {favorites.map((driver) => (
          <article key={driver.id} className="card">
            <header>
              <h3>{driver.name}</h3>
              <p className="muted">Rating {driver.rating}</p>
            </header>
            <ul>
              {driver.vendors.map((vendor) => (
                <li key={vendor}>{vendor}</li>
              ))}
            </ul>
            <div className="card-actions">
              <button className="button button--ghost" type="button">Remove favorite</button>
            </div>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}

export default CustomerFavoritesPage;
