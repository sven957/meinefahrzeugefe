import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Chip,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import { Edit, Delete, Warning } from '@mui/icons-material';
import { reminderService } from '../services/reminderService';
import dayjs from 'dayjs';

const ReminderList = ({ onEdit, onDelete }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReminders();
    }, []);

    const loadReminders = async () => {
        try {
            const response = await reminderService.getAllReminders();
            console.log('API Response:', response); // Debug log
            // Handle different response formats
            const reminderData = response.data || response || [];
            setReminders(Array.isArray(reminderData) ? reminderData : []);
        } catch (error) {
            console.error('Fehler beim Laden der Erinnerungen:', error);
            setReminders([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Aufgabe wirklich löschen?')) {
            try {
                await reminderService.deleteReminder(id);
                loadReminders(); // Liste neu laden
                if (onDelete) onDelete();
            } catch (error) {
                console.error('Fehler beim Löschen:', error);
            }
        }
    };


    if (loading) {
        return <Typography>Lade Erinnerungen...</Typography>;
    }

    return (
        <Box sx={{ mt: 2 }}>
            <Typography variant="h6" gutterBottom>
                Erinnerungen
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fahrzeug</TableCell>
                            <TableCell>Titel</TableCell>
                            <TableCell>Beschreibung</TableCell>
                            <TableCell>Fälligkeitsdatum</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Typ</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reminders && reminders.length > 0 ? (
                            reminders.map((reminder) => (
                                <TableRow key={reminder.id}>
                                    <TableCell>{reminder.vehicle?.licensePlate}</TableCell>
                                    <TableCell>{reminder.title}</TableCell>
                                    <TableCell>{reminder.description}</TableCell>
                                    <TableCell>{dayjs(reminder.dueDate).format('DD.MM.YYYY')}</TableCell>
                                    <TableCell>
                                        {reminder.status === 'OVERDUE' ? (
                                            <Chip
                                                icon={<Warning />}
                                                label="Überfällig"
                                                color="error"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        ) : (
                                            <Chip
                                                label={reminder.status}
                                                color="default"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{reminder.type}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => onEdit(reminder)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(reminder.id)}>
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <Typography variant="body2" color="text.secondary">
                                        Keine Erinnerungen vorhanden
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ReminderList;