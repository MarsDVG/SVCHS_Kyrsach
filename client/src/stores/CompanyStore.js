import { makeAutoObservable, runInAction } from 'mobx';
import {
  fetchCompanies,
  fetchCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from '../api/companyApi';

class CompanyStore {
  companies = [];
  selectedCompany = null;
  loading = false;
  error = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async loadCompanies() {
    this.loading = true;
    this.error = null;
    try {
      const res = await fetchCompanies();
      console.log(res)
      runInAction(() => {
        this.companies = Array.isArray(res) ? res.slice() : [];
      });
    } catch (e) {
      runInAction(() => {
        this.error = e;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async loadCompany(id) {
    this.loading = true;
    this.error = null;
    try {
      const { data } = await fetchCompany(id);
      runInAction(() => {
        this.selectedCompany = data;
      });
    } catch (e) {
      runInAction(() => {
        this.error = e;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async addCompany(companyData) {
    this.loading = true;
    this.error = null;
    try {
      await createCompany({ img: companyData.img });
      await this.loadCompanies();
    } catch (e) {
      runInAction(() => {
        this.error = e;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async editCompany(id, companyData) {
    this.loading = true;
    this.error = null;
    try {
      await updateCompany(id, { img: companyData.img });
      await this.loadCompanies();
    } catch (e) {
      runInAction(() => {
        this.error = e;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async removeCompany(id) {
    this.loading = true;
    this.error = null;
    try {
      await deleteCompany(id);
      await this.loadCompanies();
    } catch (e) {
      runInAction(() => {
        this.error = e;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }
}

export default new CompanyStore();
