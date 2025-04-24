const USER_DATA_KEY = 'auth_user_data';

export function setUserData(data) {
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(data));
}

export function parseJwt(token) {
  if (!token) return null
  const base64Url = token.split('.')[1]
  if (!base64Url) return null
  try {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

export function getUserData() {
  const raw = localStorage.getItem(USER_DATA_KEY);
  const data = raw ? JSON.parse(raw) : null;
  if (data && data.token) {
    const payload = parseJwt(data.token)
    if (payload && payload.role) {
      data.role = payload.role
      data.id = payload.id
    }
  }
  return data;
}

export function removeUserData() {
  localStorage.removeItem(USER_DATA_KEY);
}
