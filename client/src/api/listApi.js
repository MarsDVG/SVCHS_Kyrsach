import api from './index';

export function fetchUserOrders(userId) {
  return api.get(`/list/${userId}`);
}

export function removeFromList(listId, companyId) {
  return api.post(`/list/remove`, { listId, companyId });
}
