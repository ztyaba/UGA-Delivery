export const demoVendors = [
  { id: '64b64f2f0000000000001001', name: 'Kampala Eats', cuisine: 'Ugandan Classics', eta: '30-40 min', badge: 'Matoke Bowls' },
  { id: '64b64f2f0000000000001002', name: 'Jinja Street Grill', cuisine: 'BBQ & Street Food', eta: '25-35 min', badge: 'Rolex wraps' },
  { id: '64b64f2f0000000000001003', name: 'Gulu Green Kitchen', cuisine: 'Vegetarian & Healthy', eta: '35-45 min', badge: 'Millet power' }
];

export const demoUsers = {
  customer: {
    id: '64b64f2f0000000000002001',
    name: 'Demo Customer'
  },
  driver: {
    id: '64b64f2f0000000000003001',
    name: 'Demo Driver'
  },
  vendor: {
    id: demoVendors[0].id,
    name: 'Kampala Eats Vendor'
  }
};

export const defaultVendorId = demoVendors[0].id;
