import api from './index'

export const fetchCars = () => api.get('/car')
export const addCar = (data) => api.post('/car', data)
export const updateCar = (id, data) => api.put(`/car/${id}`, data)
export const deleteCar = (id) => api.delete(`/car/${id}`)
