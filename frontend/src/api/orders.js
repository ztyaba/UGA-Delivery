import { apiRequest, buildQueryString } from './client.js';

export function createOrder (auth, payload) {
  return apiRequest('/orders', { method: 'POST', data: payload, auth });
}

export function listOrders (auth, params) {
  return apiRequest(`/orders${buildQueryString(params)}`, { auth });
}

export function getOrder (auth, orderId) {
  return apiRequest(`/orders/${orderId}`, { auth });
}

export function confirmOrder (auth, orderId, payload) {
  return apiRequest(`/orders/${orderId}/confirm`, { method: 'POST', data: payload, auth });
}

export function markReady (auth, orderId) {
  return apiRequest(`/orders/${orderId}/ready`, { method: 'POST', auth });
}

export function assignOrder (auth, orderId, payload = {}) {
  return apiRequest(`/orders/${orderId}/assign`, { method: 'POST', data: payload, auth });
}

export function markPickedUp (auth, orderId) {
  return apiRequest(`/orders/${orderId}/pickedup`, { method: 'POST', auth });
}

export function markDelivered (auth, orderId, payload) {
  return apiRequest(`/orders/${orderId}/deliver`, { method: 'POST', data: payload, auth });
}

export function approveDeliveryPhoto (auth, orderId) {
  return apiRequest(`/orders/${orderId}/delivery-photo/approve`, { method: 'POST', auth });
}

export function rejectDeliveryPhoto (auth, orderId, payload) {
  return apiRequest(`/orders/${orderId}/delivery-photo/reject`, { method: 'POST', data: payload, auth });
}

export function payDriver (auth, orderId) {
  return apiRequest(`/orders/${orderId}/pay-driver`, { method: 'POST', auth });
}

export function rateDriver (auth, orderId, payload) {
  return apiRequest(`/orders/${orderId}/rate-driver`, { method: 'POST', data: payload, auth });
}
