const BASE_URL = 'http://localhost:5000/api'

let getToken = () => ''

class Api {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  setTokenProvider(fn) {
    getToken = fn
  }

  async request(path, { method = 'GET', headers = {}, body = null, token } = {}) {
    const fetchHeaders = { 'Content-Type': 'application/json', ...headers }
    const authToken = token !== undefined ? token : getToken()
    if (authToken) {
      fetchHeaders['Authorization'] = `Bearer ${authToken}`
    }
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: fetchHeaders,
      body: body ? JSON.stringify(body) : null,
    })
    if (!response.ok) {
      throw new Error(`Status ${response.status}`)
    }
    return response.json()
  }

  get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' })
  }

  post(path, body, options = {}) {
    return this.request(path, { ...options, method: 'POST', body })
  }

  put(path, body, options = {}) {
    return this.request(path, { ...options, method: 'PUT', body })
  }

  delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' })
  }
}

const api = new Api(BASE_URL)

export async function loginApi({ email, password }) {
  return api.post('/user/login', { email, password })
}

export default api
