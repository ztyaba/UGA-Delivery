import { useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

const steps = ['Pending', 'Preparing', 'Ready for Pickup', 'On the Way', 'Delivered'];

function CustomerOrderTrackingPage () {
  const { orderId } = useParams();
  const completedIndex = 3;

  return (
    <PageLayout
      title={`Order tracker: ${orderId}`}
      description="Each state updates via Socket.IO to keep customers, drivers, and vendors aligned."
    >
      <ol className="tracker">
        {steps.map((step, index) => (
          <li key={step} className={index <= completedIndex ? 'tracker-step tracker-step--complete' : 'tracker-step'}>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="card">
        <h3>Driver details</h3>
        <p>Assigned driver: Grace N.</p>
        <p>Selected by customer: Yes</p>
      </div>
    </PageLayout>
  );
}

export default CustomerOrderTrackingPage;
