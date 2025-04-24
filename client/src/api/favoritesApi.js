import api from './index';

export function fetchUserFavorites(userId) {
  return api.get(`/favorites`);
}

export function addFavoriteCompany(userId, companyId) {
  return api.post(`/favorites`, { userId, companyId });
}

export function removeFavoriteCompany(userId, companyId) {
  return api.post(`/favorites/remove`, { userId, companyId });
}
