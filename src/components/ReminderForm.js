import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { reminderService } from '../services/reminderService';
import { vehicleService } from '../services/vehicleService';
import dayjs from 'dayjs';
import 'dayjs/locale/de';

dayjs.locale('de');

const REMINDER_TYPES = [
    { value: 'LEASE_END', label: 'Leasingrückgabe' },
    { value: 'LICENSE_CHECK', label: 'Führerscheinüberprüfung' },
    { value: 'TUV', label: 'TÜV/HU' },
    { value: 'INSURANCE', label: 'Versicherung' },
    { value: 'MAINTENANCE', label: 'Wartung' },
    { value: 'OTHER', label: 'Sonstiges' }
];

const ReminderForm = ({ open, onClose, reminder, onSave }) => {
    const [formData, setFormData] = useState({
        vehicleId: '',
        title: '',
        description: '',
        dueDate: null,
        type: 'MAINTENANCE'
    });
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            loadVehicles();
        }
    }, [open]);

    useEffect(() => {
        if (reminder) {
            // Bearbeiten - Formular mit vorhandenen Daten füllen
            setFormData({
                vehicleId: reminder.vehicle?.id || '',
                title: reminder.title || '',
                description: reminder.description || '',
                dueDate: reminder.dueDate ? dayjs(reminder.dueDate) : null,
                type: reminder.type || 'MAINTENANCE'
            });
        } else {
            // Neu erstellen - Formular zurücksetzen
            setFormData({
                vehicleId: '',
                title: '',
                description: '',
                dueDate: null,
                type: 'MAINTENANCE'
            });
        }
        setErrors({});
    }, [reminder, open]);

    const loadVehicles = async () => {
        try {
            const response = await vehicleService.getAllVehicles();
            setVehicles(response.data || []);
        } catch (error) {
            console.error('Fehler beim Laden der Fahrzeuge:', error);
            setVehicles([]);
        }
    };

    const handleChange = (field) => (event) => {
        const value = event.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Fehler für dieses Feld löschen
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleDateChange = (date) => {
        setFormData(prev => ({
            ...prev,
            dueDate: date
        }));
        
        // Fehler für Datum löschen
        if (errors.dueDate) {
            setErrors(prev => ({
                ...prev,
                dueDate: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.vehicleId) {
            newErrors.vehicleId = 'Fahrzeug ist erforderlich';
        }

        if (!formData.title.trim()) {
            newErrors.title = 'Titel ist erforderlich';
        }

        if (!formData.dueDate) {
            newErrors.dueDate = 'Fälligkeitsdatum ist erforderlich';
        }

        if (!formData.type) {
            newErrors.type = 'Typ ist erforderlich';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Find selected vehicle
            const selectedVehicle = vehicles.find(v => v.id === formData.vehicleId);
            
            const reminderData = {
                vehicle: selectedVehicle,
                title: formData.title.trim(),
                description: formData.description.trim(),
                dueDate: formData.dueDate.format('YYYY-MM-DD'),
                type: formData.type,
                status: 'PENDING'
            };

            if (reminder) {
                // Bearbeiten
                await reminderService.updateReminder(reminder.id, reminderData);
            } else {
                // Neu erstellen
                await reminderService.createReminder(reminderData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Fehler beim Speichern der Erinnerung:', error);
            // Hier könntest du eine Snackbar oder andere Fehleranzeige hinzufügen
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {reminder ? 'Erinnerung bearbeiten' : 'Neue Erinnerung'}
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <FormControl fullWidth error={!!errors.vehicleId}>
                                    <InputLabel>Fahrzeug *</InputLabel>
                                    <Select
                                        value={formData.vehicleId}
                                        onChange={handleChange('vehicleId')}
                                        label="Fahrzeug *"
                                    >
                                        {vehicles.map((vehicle) => (
                                            <MenuItem key={vehicle.id} value={vehicle.id}>
                                                {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.vehicleId && (
                                        <FormHelperText>{errors.vehicleId}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Titel"
                                    value={formData.title}
                                    onChange={handleChange('title')}
                                    error={!!errors.title}
                                    helperText={errors.title}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth error={!!errors.type}>
                                    <InputLabel>Typ *</InputLabel>
                                    <Select
                                        value={formData.type}
                                        onChange={handleChange('type')}
                                        label="Typ *"
                                    >
                                        {REMINDER_TYPES.map((type) => (
                                            <MenuItem key={type.value} value={type.value}>
                                                {type.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {errors.type && (
                                        <FormHelperText>{errors.type}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Beschreibung"
                                    value={formData.description}
                                    onChange={handleChange('description')}
                                    multiline
                                    rows={3}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Fälligkeitsdatum *"
                                    value={formData.dueDate}
                                    onChange={handleDateChange}
                                    format="DD.MM.YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: !!errors.dueDate,
                                            helperText: errors.dueDate
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>

                <DialogActions>
                    <Button onClick={onClose}>
                        Abbrechen
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        disabled={loading}
                    >
                        {loading ? 'Speichere...' : 'Speichern'}
                    </Button>
                </DialogActions>
            </Dialog>
        </LocalizationProvider>
    );
};

export default ReminderForm;
