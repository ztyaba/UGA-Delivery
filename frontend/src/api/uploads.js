import { apiRequest } from './client.js';

export function uploadDeliveryPhoto (auth, file) {
  const form = new FormData();
  form.append('file', file);
  return apiRequest('/uploads/delivery-photo', { method: 'POST', data: form, auth });
}

export function uploadIdDocument (auth, file) {
  const form = new FormData();
  form.append('file', file);
  return apiRequest('/uploads/id', { method: 'POST', data: form, auth });
}
