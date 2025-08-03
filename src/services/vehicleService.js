import { api } from './authService';

const API_BASE_URL = '/api/vehicles';

export const vehicleService = {
  // Alle Fahrzeuge abrufen
  getAllVehicles: (sortBy = 'id', sortDir = 'asc') => 
    api.get(`${API_BASE_URL}?sortBy=${sortBy}&sortDir=${sortDir}`),
  
  // Einzelnes Fahrzeug abrufen
  getVehicleById: (id) => api.get(`${API_BASE_URL}/${id}`),
  
  // Fahrzeug erstellen
  createVehicle: (vehicle) => api.post(API_BASE_URL, vehicle),
  
  // Fahrzeug aktualisieren
  updateVehicle: (id, vehicle) => api.put(`${API_BASE_URL}/${id}`, vehicle),
  
  // Fahrzeug löschen
  deleteVehicle: (id) => api.delete(`${API_BASE_URL}/${id}`),
  
  // Spezielle Endpoints
  getUnassignedVehicles: () => api.get(`${API_BASE_URL}/unassigned`),
  getVehiclesWithLeaseEndingSoon: (days = 30) => 
    api.get(`${API_BASE_URL}/lease-ending-soon?days=${days}`)
};