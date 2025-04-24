import { makeAutoObservable } from 'mobx';
import { loginApi } from '../api';
import { setUserData, getUserData, removeUserData } from '../utils/storage';

class AuthStore {
  email = '';
  password = '';
  token = '';
  isLoading = false;
  error = '';

  constructor() {
    makeAutoObservable(this);
    const userData = getUserData();
    if (userData) {
      this.token = userData.token || '';
      this.email = userData.email || '';
    }
    // Provide token to API
    import('../api').then(({ default: api }) => {
      api.setTokenProvider(() => this.token)
    })
  }

  setEmail(value) {
    this.email = value;
  }

  setPassword(value) {
    this.password = value;
  }

  async login() {
    this.isLoading = true;
    this.error = '';
    try {
      const data = await loginApi({ email: this.email, password: this.password });
      this.token = data.token;
      setUserData({ token: data.token, email: this.email });
      // Update token in API
      import('../api').then(({ default: api }) => {
        api.setTokenProvider(() => this.token)
      })
    } catch (e) {
      this.error = 'Ошибка при входе';
    } finally {
      this.isLoading = false;
    }
  }

  logout() {
    this.token = '';
    removeUserData();
    // Update token in API
    import('../api').then(({ default: api }) => {
      api.setTokenProvider(() => this.token)
    })
  }

  getUserData() {
    return getUserData();
  }
}

const authStore = new AuthStore();
export default authStore;
