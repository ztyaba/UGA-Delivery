import { apiRequest } from './client.js';

export function getCustomerProfile (auth, customerId) {
  return apiRequest(`/customers/${customerId}`, { auth });
}

export function addFavoriteDriver (auth, customerId, driverId) {
  return apiRequest(`/customers/${customerId}/favorites`, {
    method: 'POST',
    auth,
    data: { driverId }
  });
}

export function removeFavoriteDriver (auth, customerId, driverId) {
  return apiRequest(`/customers/${customerId}/favorites/${driverId}`, {
    method: 'DELETE',
    auth
  });
}
