import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const panels = [
  { title: 'Pending orders', value: 3 },
  { title: 'Ready for pickup', value: 1 },
  { title: 'Driver applications', value: 4 }
];

function VendorDashboardPage () {
  return (
    <PageLayout
      title="Vendor dashboard"
      description="Oversee customer privacy, payouts, and driver verification in a single hub."
      actions={<Link className="button button--secondary" to="/vendor/applications">Review applications</Link>}
    >
      <div className="grid">
        {panels.map((panel) => (
          <article key={panel.title} className="card">
            <h3>{panel.title}</h3>
            <p className="stat-value">{panel.value}</p>
          </article>
        ))}
      </div>
      <div className="card">
        <h3>Live orders</h3>
        <p>Incoming orders show anonymous labels when customers hide their identity. Use the detail view to confirm payouts.</p>
        <Link className="button" to="/vendor/orders/order-3001">Open latest order</Link>
      </div>
    </PageLayout>
  );
}

export default VendorDashboardPage;
