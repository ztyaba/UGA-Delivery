import PageLayout from '../../components/PageLayout.jsx';

const approvedVendors = [
  { id: 'vendor-001', name: 'Kampala Eats', selected: true },
  { id: 'vendor-002', name: 'Jinja Street Grill', selected: true },
  { id: 'vendor-003', name: 'Gulu Green Kitchen', selected: false }
];

function DriverVendorsPage () {
  return (
    <PageLayout
      title="Vendors I deliver for"
      description="Pick which approved vendors appear on your public profile and job filters."
    >
      <div className="card">
        {approvedVendors.map((vendor) => (
          <label key={vendor.id} className="checkbox-row">
            <input type="checkbox" defaultChecked={vendor.selected} />
            <span>{vendor.name}</span>
          </label>
        ))}
        <button className="button" type="button">Save visibility</button>
      </div>
    </PageLayout>
  );
}

export default DriverVendorsPage;
