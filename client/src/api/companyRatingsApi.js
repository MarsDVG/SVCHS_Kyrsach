import api from './index'

export const fetchCompanyRatings = () => api.get('/company_ratings');
export const fetchCompanyRatingsByCompanyId = (companyId) => api.get(`/company_ratings/${companyId}`);
export const createCompanyRating = (data) => api.post('/company_ratings', data);
