import { useParams } from 'react-router-dom';
import PageLayout from '../../components/PageLayout.jsx';

function VendorOrderDetailPage () {
  const { orderId } = useParams();

  return (
    <PageLayout
      title={`Vendor order detail: ${orderId}`}
      description="Adjust payout, approve proof-of-delivery photos, or trigger manual payments."
    >
      <div className="card">
        <h3>Customer information</h3>
        <p className="muted">Privacy-aware label: Customer #4</p>
        <p>Delivery address: Plot 18, Bugolobi</p>
        <p>Contact channel: In-app chat</p>
      </div>

      <div className="card">
        <h3>Driver payout</h3>
        <label>
          Amount (UGX)
          <input type="number" defaultValue={7500} />
        </label>
        <div className="card-actions">
          <button className="button button--ghost" type="button">Confirm order</button>
          <button className="button" type="button">Mark ready</button>
        </div>
      </div>

      <div className="card">
        <h3>Delivery photo review</h3>
        <p>Driver uploaded a photo 2 minutes ago. Approve to release payout or reject with guidance.</p>
        <div className="card-actions">
          <button className="button button--ghost" type="button">Reject photo</button>
          <button className="button" type="button">Approve & pay</button>
        </div>
        <p className="muted">Auto-pay occurs if no action is taken within 5 minutes.</p>
      </div>
    </PageLayout>
  );
}

export default VendorOrderDetailPage;
