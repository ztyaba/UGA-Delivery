import PageLayout from '../../components/PageLayout.jsx';

function DriverProfilePage () {
  return (
    <PageLayout
      title="Driver profile"
      description="Upload ID, selfies, and complete contact details required for vendor review."
    >
      <div className="card form-card">
        <label>
          Full name
          <input type="text" placeholder="Enter full name" />
        </label>
        <label>
          Phone
          <input type="text" placeholder="0700 111 222" />
        </label>
        <label>
          ID image URL
          <input type="text" placeholder="/uploads/id-123.jpg" />
        </label>
        <label>
          Selfie URL
          <input type="text" placeholder="/uploads/selfie-123.jpg" />
        </label>
        <button className="button" type="button">Save profile</button>
      </div>
    </PageLayout>
  );
}

export default DriverProfilePage;
