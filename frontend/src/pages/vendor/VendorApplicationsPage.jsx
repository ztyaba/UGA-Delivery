import PageLayout from '../../components/PageLayout.jsx';

const applications = [
  { id: 'app-501', name: 'Moses K.', phone: '0772 555 123', status: 'Applied' },
  { id: 'app-502', name: 'Emily R.', phone: '0788 444 222', status: 'Invited' }
];

function VendorApplicationsPage () {
  return (
    <PageLayout
      title="Driver applications"
      description="Review ID + selfie submissions, invite drivers for verification, and approve once satisfied."
    >
      <div className="grid">
        {applications.map((application) => (
          <article key={application.id} className="card">
            <header>
              <h3>{application.name}</h3>
              <p className="muted">{application.phone}</p>
            </header>
            <p className="badge">{application.status}</p>
            <div className="card-actions">
              <button className="button button--ghost" type="button">Invite</button>
              <button className="button" type="button">Approve</button>
            </div>
          </article>
        ))}
      </div>
    </PageLayout>
  );
}

export default VendorApplicationsPage;
