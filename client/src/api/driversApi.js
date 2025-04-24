import api from './index'

export const fetchDrivers = () => api.get('/driver')
export const fetchDriver = (id) => api.get(`/driver/${id}`)
export const addDriver = (data) => api.post('/driver', data)
export const updateDriver = (id, data) => api.put(`/driver/${id}`, data)
export const deleteDriver = (id) => api.delete(`/driver/${id}`)
