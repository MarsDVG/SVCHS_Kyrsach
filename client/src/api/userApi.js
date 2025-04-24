import api from './index';

export async function registrationApi({ email, password }) {
  return api.post('/user/registration', { email, password, role: 'USER' });
}

export function fetchUsers() {
  return api.get('/user/users/report')
}

export function controlUser(userId, action) {
  return api.put('/user/control', { userId, action })
}
