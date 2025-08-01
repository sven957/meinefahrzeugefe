import axios from 'axios';

const API_BASE_URL = '/api/vehicles';

export const vehicleService = {
  // Alle Fahrzeuge abrufen
  getAllVehicles: () => axios.get(API_BASE_URL),
  
  // Einzelnes Fahrzeug abrufen
  getVehicleById: (id) => axios.get(`${API_BASE_URL}/${id}`),
  
  // Fahrzeug erstellen
  createVehicle: (vehicle) => axios.post(API_BASE_URL, vehicle),
  
  // Fahrzeug aktualisieren
  updateVehicle: (id, vehicle) => axios.put(`${API_BASE_URL}/${id}`, vehicle),
  
  // Fahrzeug löschen
  deleteVehicle: (id) => axios.delete(`${API_BASE_URL}/${id}`),
  
  // Spezielle Endpoints
  getUnassignedVehicles: () => axios.get(`${API_BASE_URL}/unassigned`),
  getVehiclesWithLeaseEndingSoon: (days = 30) => 
    axios.get(`${API_BASE_URL}/lease-ending-soon?days=${days}`)
};