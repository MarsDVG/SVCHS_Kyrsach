import api from './index'; 

export const fetchPromotions = () => api.get('/promotion');

export const fetchPromotionById = (id) => api.get(`/promotion/${id}`);

export const createPromotion = (data) => api.post('/promotion', data);

export const updatePromotion = (id, data) => api.put(`/promotion/${id}`, data);

export const deletePromotion = (id) => api.delete(`/promotion/${id}`);