import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Grid,
    Box
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { vehicleService } from '../services/vehicleService';
import dayjs from 'dayjs';
import 'dayjs/locale/de';

dayjs.locale('de');

const VehicleForm = ({ open, onClose, vehicle, onSave }) => {
    const [formData, setFormData] = useState({
        licensePlate: '',
        brand: '',
        model: '',
        year: '',
        driverName: '',
        driverEmail: '',
        leaseEndDate: null
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (vehicle) {
            // Bearbeiten - Formular mit vorhandenen Daten füllen
            setFormData({
                licensePlate: vehicle.licensePlate || '',
                brand: vehicle.brand || '',
                model: vehicle.model || '',
                year: vehicle.year || '',
                driverName: vehicle.driverName || '',
                driverEmail: vehicle.driverEmail || '',
                leaseEndDate: vehicle.leaseEndDate ? dayjs(vehicle.leaseEndDate) : null
            });
        } else {
            // Neu erstellen - Formular zurücksetzen
            setFormData({
                licensePlate: '',
                brand: '',
                model: '',
                year: '',
                driverName: '',
                driverEmail: '',
                leaseEndDate: null
            });
        }
        setErrors({});
    }, [vehicle, open]);

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
            leaseEndDate: date
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.licensePlate.trim()) {
            newErrors.licensePlate = 'Kennzeichen ist erforderlich';
        }

        if (!formData.brand.trim()) {
            newErrors.brand = 'Marke ist erforderlich';
        }

        if (!formData.model.trim()) {
            newErrors.model = 'Modell ist erforderlich';
        }

        if (formData.year && (formData.year < 1900 || formData.year > new Date().getFullYear() + 1)) {
            newErrors.year = 'Ungültiges Baujahr';
        }

        if (formData.driverEmail && !/\S+@\S+\.\S+/.test(formData.driverEmail)) {
            newErrors.driverEmail = 'Ungültige E-Mail-Adresse';
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
            const vehicleData = {
                ...formData,
                year: formData.year ? parseInt(formData.year) : null,
                leaseEndDate: formData.leaseEndDate ? formData.leaseEndDate.format('YYYY-MM-DD') : null
            };

            if (vehicle) {
                // Bearbeiten
                await vehicleService.updateVehicle(vehicle.id, vehicleData);
            } else {
                // Neu erstellen
                await vehicleService.createVehicle(vehicleData);
            }

            onSave();
            onClose();
        } catch (error) {
            console.error('Fehler beim Speichern:', error);
            // Hier könntest du eine Snackbar oder andere Fehleranzeige hinzufügen
        } finally {
            setLoading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>
                    {vehicle ? 'Fahrzeug bearbeiten' : 'Neues Fahrzeug'}
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Kennzeichen"
                                    value={formData.licensePlate}
                                    onChange={handleChange('licensePlate')}
                                    error={!!errors.licensePlate}
                                    helperText={errors.licensePlate}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Baujahr"
                                    type="number"
                                    value={formData.year}
                                    onChange={handleChange('year')}
                                    error={!!errors.year}
                                    helperText={errors.year}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Marke"
                                    value={formData.brand}
                                    onChange={handleChange('brand')}
                                    error={!!errors.brand}
                                    helperText={errors.brand}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Modell"
                                    value={formData.model}
                                    onChange={handleChange('model')}
                                    error={!!errors.model}
                                    helperText={errors.model}
                                    required
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fahrer Name"
                                    value={formData.driverName}
                                    onChange={handleChange('driverName')}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Fahrer E-Mail"
                                    type="email"
                                    value={formData.driverEmail}
                                    onChange={handleChange('driverEmail')}
                                    error={!!errors.driverEmail}
                                    helperText={errors.driverEmail}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Leasing Ende"
                                    value={formData.leaseEndDate}
                                    onChange={handleDateChange}
                                    format="DD.MM.YYYY"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true
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

export default VehicleForm;