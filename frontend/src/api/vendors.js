import { apiRequest, buildQueryString } from './client.js';

export function getVendor (vendorId) {
  return apiRequest(`/vendors/${vendorId}`);
}

export function getApprovedDrivers (vendorId, params) {
  return apiRequest(`/vendors/${vendorId}/approved-drivers${buildQueryString(params)}`);
}

export function inviteDriver (auth, vendorId, appId) {
  return apiRequest(`/vendors/${vendorId}/applications/${appId}/invite`, { method: 'POST', auth });
}

export function approveDriver (auth, vendorId, appId) {
  return apiRequest(`/vendors/${vendorId}/applications/${appId}/approve`, { method: 'POST', auth });
}

export function rejectDriver (auth, vendorId, appId) {
  return apiRequest(`/vendors/${vendorId}/applications/${appId}/reject`, { method: 'POST', auth });
}
