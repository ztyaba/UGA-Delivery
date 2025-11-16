import { useMemo, useState } from 'react';
import PageLayout from '../../components/PageLayout.jsx';
import { useDemoAuth } from '../../context/DemoAuthContext.jsx';
import { demoVendors } from '../../config/demoUsers.js';
import { applyToVendor } from '../../api/drivers.js';
import { uploadIdDocument } from '../../api/uploads.js';

function DriverProfilePage () {
  const { role, user } = useDemoAuth();
  const auth = useMemo(() => ({ id: user.id, role }), [user.id, role]);
  const [form, setForm] = useState({
    fullName: 'Demo Driver',
    phone: '0700 111 222',
    vendorId: demoVendors[0].id,
    idImageUrl: '',
    selfieUrl: ''
  });
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (field, file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await uploadIdDocument(auth, file);
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      await applyToVendor(auth, user.id, {
        vendorId: form.vendorId,
        idImageUrl: form.idImageUrl,
        selfieUrl: form.selfieUrl,
        phone: form.phone
      });
      setMessage('Application submitted to vendor.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <PageLayout
      title="Driver profile"
      description="Upload ID, selfies, and complete contact details required for vendor review."
    >
      {message && <p className="info-text">{message}</p>}
      <div className="card form-card">
        <label>
          Full name
          <input type="text" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} />
        </label>
        <label>
          Phone
          <input type="text" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        </label>
        <label>
          Vendor applying to
          <select value={form.vendorId} onChange={(event) => setForm({ ...form, vendorId: event.target.value })}>
            {demoVendors.map((vendor) => (
              <option key={vendor.id} value={vendor.id}>{vendor.name}</option>
            ))}
          </select>
        </label>
        <label>
          ID image URL
          <input type="text" value={form.idImageUrl} onChange={(event) => setForm({ ...form, idImageUrl: event.target.value })} />
        </label>
        <label className="upload-input">
          <input type="file" accept="image/*" onChange={(event) => handleUpload('idImageUrl', event.target.files[0])} />
          <span>{uploading ? 'Uploading…' : 'Upload ID image'}</span>
        </label>
        <label>
          Selfie URL
          <input type="text" value={form.selfieUrl} onChange={(event) => setForm({ ...form, selfieUrl: event.target.value })} />
        </label>
        <label className="upload-input">
          <input type="file" accept="image/*" onChange={(event) => handleUpload('selfieUrl', event.target.files[0])} />
          <span>{uploading ? 'Uploading…' : 'Upload selfie'}</span>
        </label>
        <button className="button" type="button" onClick={handleSubmit} disabled={uploading || role !== 'driver'}>
          Submit vendor application
        </button>
      </div>
    </PageLayout>
  );
}

export default DriverProfilePage;
