import axios from 'axios';
const API_BASE_URL = '/api/reminders';

export const reminderService = {
    // Alle Erinnerungen abrufen
    getAllReminders: async () => {
        const response = await axios.get(API_BASE_URL);
        return response; // Return the full response object so component can access response.data
    },

    // Einzelne Erinnerung abrufen
    getReminderById: async (id) => {
        const response = await axios.get(`${API_BASE_URL}/${id}`);
        return response.data;
    },

    // Erinnerung erstellen
    createReminder: async (reminder) => {
        const response = await axios.post(API_BASE_URL, reminder);
        return response.data;
    },

    // Erinnerung aktualisieren
    updateReminder: async (id, reminder) => {
        const response = await axios.put(`${API_BASE_URL}/${id}`, reminder);
        return response.data;
    },

    // Erinnerung löschen
    deleteReminder: async (id) => {
        const response = await axios.delete(`${API_BASE_URL}/${id}`);
        return response.data;
    },

    // Status einer Erinnerung aktualisieren
    updateReminderStatus: async (id, status) => {
        const response = await axios.put(`${API_BASE_URL}/${id}/status`, status, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    },

    // Erinnerung als erledigt markieren
    markAsCompleted: async (id) => {
        const response = await axios.put(`${API_BASE_URL}/${id}/complete`);
        return response.data;
    },

    // Erinnerung als offen markieren
    markAsPending: async (id) => {
        const response = await axios.put(`${API_BASE_URL}/${id}/pending`);
        return response.data;
    }
};