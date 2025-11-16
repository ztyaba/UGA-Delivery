import PageLayout from '../../components/PageLayout.jsx';

const approvedDrivers = [
  { id: 'driver-51', name: 'Aisha K.', rating: 4.97, deliveries: 320 },
  { id: 'driver-52', name: 'John S.', rating: 4.85, deliveries: 210 }
];

function VendorApprovedDriversPage () {
  return (
    <PageLayout
      title="Approved drivers"
      description="Full roster of drivers cleared to accept jobs for this vendor."
    >
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rating</th>
            <th>Deliveries</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {approvedDrivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>
              <td>{driver.rating}</td>
              <td>{driver.deliveries}</td>
              <td>
                <button className="button button--ghost" type="button">View profile</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </PageLayout>
  );
}

export default VendorApprovedDriversPage;
