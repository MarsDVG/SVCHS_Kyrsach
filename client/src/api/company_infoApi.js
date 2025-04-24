import api from './index'

export const fetchAllCompanyInfo = () => api.get('/company_info')
export const fetchCompanyInfoById = (id) => api.get(`/company_info/${id}`)
export const createCompanyInfo = (data) => api.post('/company_info', data)
export const updateCompanyInfo = (id, data) => api.put(`/company_info/${id}`, data)
export const deleteCompanyInfo = (id) => api.delete(`/company_info/${id}`)
