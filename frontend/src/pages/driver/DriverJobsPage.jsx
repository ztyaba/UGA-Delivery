import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const availableJobs = [
  { id: 'order-2001', vendor: 'Kampala Eats', payout: 'UGX 8,500', distance: '3.2 km' },
  { id: 'order-2002', vendor: 'Gulu Green Kitchen', payout: 'UGX 7,400', distance: '4.5 km' }
];

const activeOrders = [
  { id: 'order-1999', vendor: 'Jinja Street Grill', status: 'Picked Up', customerSelected: true }
];

function DriverJobsPage () {
  return (
    <PageLayout
      title="Delivery jobs"
      description="View open deliveries filtered by approved vendors. Accepting an order locks it atomically."
    >
      <div className="card">
        <h3>Available jobs</h3>
        {availableJobs.map((job) => (
          <div key={job.id} className="job-row">
            <div>
              <strong>{job.vendor}</strong>
              <p className="muted">{job.distance} away · {job.payout}</p>
            </div>
            <button className="button button--ghost" type="button">Accept</button>
          </div>
        ))}
      </div>

      <div className="card">
        <h3>Active deliveries</h3>
        {activeOrders.map((order) => (
          <div key={order.id} className="job-row">
            <div>
              <strong>{order.vendor}</strong>
              <p className="muted">Status: {order.status}</p>
              {order.customerSelected && <p className="badge">Customer specifically selected you</p>}
            </div>
            <Link className="button" to={`/driver/orders/${order.id}`}>Manage</Link>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}

export default DriverJobsPage;
