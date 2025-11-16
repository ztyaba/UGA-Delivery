import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const summary = [
  { label: 'Verification status', value: 'Approved for 3 vendors' },
  { label: 'Wallet balance', value: 'UGX 145,000' },
  { label: 'Deliveries this week', value: '12' }
];

function DriverDashboardPage () {
  return (
    <PageLayout
      title="Driver dashboard"
      description="Monitor verification, availability, open jobs, and payouts in one place."
      actions={<Link className="button button--secondary" to="/driver/jobs">View jobs</Link>}
    >
      <div className="grid">
        {summary.map((item) => (
          <article key={item.label} className="card">
            <h3>{item.label}</h3>
            <p className="stat-value">{item.value}</p>
          </article>
        ))}
      </div>
      <div className="card">
        <h3>Active order highlight</h3>
        <p>No active deliveries right now. Go online to receive real-time offers from approved vendors.</p>
      </div>
    </PageLayout>
  );
}

export default DriverDashboardPage;
