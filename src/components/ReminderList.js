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
    Box,
    TableSortLabel
} from '@mui/material';
import { Edit, Delete, Warning, CheckCircle, Schedule } from '@mui/icons-material';
import { reminderService } from '../services/reminderService';
import dayjs from 'dayjs';

const REMINDER_TYPE_LABELS = {
    'LEASE_END': 'Leasingrückgabe',
    'LICENSE_CHECK': 'Führerscheinüberprüfung',
    'TUV': 'TÜV/HU',
    'INSURANCE': 'Versicherung',
    'MAINTENANCE': 'Wartung',
    'OTHER': 'Sonstiges'
};

const REMINDER_STATUS_LABELS = {
    'PENDING': 'Offen',
    'COMPLETED': 'Erledigt',
    'OVERDUE': 'Überfällig'
};

const ReminderList = ({ onEdit, onDelete }) => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: 'dueDate',
        direction: 'asc'
    });

    useEffect(() => {
        loadReminders();
    }, [sortConfig]);

    const loadReminders = async () => {
        try {
            const response = await reminderService.getAllReminders(sortConfig.key, sortConfig.direction);
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

    const handleStatusChange = async (id, newStatus) => {
        try {
            if (newStatus === 'COMPLETED') {
                await reminderService.markAsCompleted(id);
            } else if (newStatus === 'PENDING') {
                await reminderService.markAsPending(id);
            } else {
                await reminderService.updateReminderStatus(id, `"${newStatus}"`);
            }
            loadReminders(); // Liste neu laden
        } catch (error) {
            console.error('Fehler beim Aktualisieren des Status:', error);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
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
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'title'}
                                    direction={sortConfig.key === 'title' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('title')}
                                >
                                    Titel
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Beschreibung</TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'dueDate'}
                                    direction={sortConfig.key === 'dueDate' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('dueDate')}
                                >
                                    Fälligkeitsdatum
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'status'}
                                    direction={sortConfig.key === 'status' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('status')}
                                >
                                    Status
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'type'}
                                    direction={sortConfig.key === 'type' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('type')}
                                >
                                    Typ
                                </TableSortLabel>
                            </TableCell>
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
                                                label={REMINDER_STATUS_LABELS[reminder.status] || reminder.status}
                                                color="error"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        ) : reminder.status === 'COMPLETED' ? (
                                            <Chip
                                                label={REMINDER_STATUS_LABELS[reminder.status] || reminder.status}
                                                color="success"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        ) : (
                                            <Chip
                                                label={REMINDER_STATUS_LABELS[reminder.status] || reminder.status}
                                                color="default"
                                                size="small"
                                                sx={{ mr: 1 }}
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{REMINDER_TYPE_LABELS[reminder.type] || reminder.type}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => onEdit(reminder)} title="Bearbeiten">
                                            <Edit />
                                        </IconButton>
                                        {reminder.status !== 'COMPLETED' && (
                                            <IconButton 
                                                onClick={() => handleStatusChange(reminder.id, 'COMPLETED')}
                                                title="Als erledigt markieren"
                                                color="success"
                                            >
                                                <CheckCircle />
                                            </IconButton>
                                        )}
                                        {reminder.status === 'COMPLETED' && (
                                            <IconButton 
                                                onClick={() => handleStatusChange(reminder.id, 'PENDING')}
                                                title="Als offen markieren"
                                                color="warning"
                                            >
                                                <Schedule />
                                            </IconButton>
                                        )}
                                        <IconButton onClick={() => handleDelete(reminder.id)} title="Löschen">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
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