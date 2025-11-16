import { Link } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const orders = [
  { id: 'order-1001', vendor: 'Kampala Eats', status: 'Preparing', driver: 'Unassigned', eta: '10 min' },
  { id: 'order-1000', vendor: 'Jinja Street Grill', status: 'Delivered', driver: 'Grace N.', eta: 'Delivered 30 mins ago' }
];

function CustomerOrdersPage () {
  return (
    <PageLayout
      title="My orders"
      description="Track each order status in realtime. Stage 6 will power these entries with live data and sockets."
    >
      <div className="timeline">
        {orders.map((order) => (
          <article key={order.id} className="card timeline-item">
            <header>
              <div>
                <h3>{order.vendor}</h3>
                <p className="muted">Order {order.id}</p>
              </div>
              <span className="badge">{order.status}</span>
            </header>
            <p>Driver: {order.driver}</p>
            <p className="muted">{order.eta}</p>
            <Link className="button button--ghost" to={`/customer/orders/${order.id}`}>Open tracker</Link>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}

export default CustomerOrdersPage;
