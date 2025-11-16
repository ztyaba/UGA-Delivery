import { apiRequest, buildQueryString } from './client.js';

export function searchDrivers (params) {
  return apiRequest(`/drivers${buildQueryString(params)}`);
}

export function getDriversByIds (ids = []) {
  if (!ids.length) return Promise.resolve({ drivers: [] });
  return apiRequest(`/drivers/by-ids${buildQueryString({ ids: ids.join(',') })}`);
}

export function getDriverProfile (auth, driverId) {
  return apiRequest(`/drivers/${driverId}`, { auth });
}

export function applyToVendor (auth, driverId, payload) {
  return apiRequest(`/drivers/${driverId}/apply-to-vendor`, { method: 'POST', data: payload, auth });
}

export function selectVendors (auth, driverId, payload) {
  return apiRequest(`/drivers/${driverId}/select-vendors`, { method: 'POST', data: payload, auth });
}
