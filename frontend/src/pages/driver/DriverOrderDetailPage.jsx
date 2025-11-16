import { useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

function DriverOrderDetailPage () {
  const { orderId } = useParams();

  return (
    <PageLayout
      title={`Manage order ${orderId}`}
      description="Upload delivery photos, view pickup notes, and finalize payout submissions."
    >
      <div className="card">
        <h3>Pickup checklist</h3>
        <ul>
          <li>Vendor: Jinja Street Grill</li>
          <li>Customer address: Block B, Plot 7</li>
          <li>Contact: masked until vendor approval</li>
        </ul>
        <button className="button button--ghost" type="button">Mark picked up</button>
      </div>

      <div className="card">
        <h3>Delivery proof</h3>
        <p>Upload a clear photo of the delivery location. Vendors can approve or reject with notes.</p>
        <label className="upload-input">
          <input type="file" disabled />
          <span>Upload photo (prototype placeholder)</span>
        </label>
        <button className="button" type="button">Submit delivery</button>
        <p className="muted">Auto-pay triggers 5 minutes after submission if the vendor takes no action.</p>
      </div>
    </PageLayout>
  );
}

export default DriverOrderDetailPage;
