import api from './index'

export const fetchCompanies = () => api.get('/company');
export const fetchCompany = (id) => api.get(`/company/${id}`);
export const createCompany = (data) => api.post('/company', data);
export const updateCompany = (id, data) => api.put(`/company/${id}`, data);
export const deleteCompany = (id) => api.delete(`/company/${id}`);
