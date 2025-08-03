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
import { Edit, Delete, Warning } from '@mui/icons-material';
import { vehicleService } from '../services/vehicleService';
import dayjs from 'dayjs';

const VehicleList = ({ onEdit, onDelete }) => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortConfig, setSortConfig] = useState({
        key: 'licensePlate',
        direction: 'asc'
    });

    useEffect(() => {
        loadVehicles();
    }, [sortConfig]);

    const loadVehicles = async () => {
        try {
            const response = await vehicleService.getAllVehicles(sortConfig.key, sortConfig.direction);
            setVehicles(response.data);
        } catch (error) {
            console.error('Fehler beim Laden der Fahrzeuge:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Fahrzeug wirklich löschen?')) {
            try {
                await vehicleService.deleteVehicle(id);
                loadVehicles(); // Liste neu laden
                if (onDelete) onDelete();
            } catch (error) {
                console.error('Fehler beim Löschen:', error);
            }
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getLeaseStatusChip = (leaseEndDate) => {
        if (!leaseEndDate) return null;

        const today = dayjs();
        const endDate = dayjs(leaseEndDate);
        const daysUntilEnd = endDate.diff(today, 'day');

        if (daysUntilEnd < 0) {
            return <Chip label="Abgelaufen" color="error" size="small" />;
        } else if (daysUntilEnd <= 30) {
            return <Chip label={`${daysUntilEnd} Tage`} color="warning" size="small" icon={<Warning />} />;
        } else {
            return <Chip label="Aktiv" color="success" size="small" />;
        }
    };

    if (loading) {
        return <Typography>Lade Fahrzeuge...</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Fahrzeuge ({vehicles.length})
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'licensePlate'}
                                    direction={sortConfig.key === 'licensePlate' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('licensePlate')}
                                >
                                    Kennzeichen
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'brand'}
                                    direction={sortConfig.key === 'brand' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('brand')}
                                >
                                    Marke
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'model'}
                                    direction={sortConfig.key === 'model' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('model')}
                                >
                                    Modell
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'year'}
                                    direction={sortConfig.key === 'year' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('year')}
                                >
                                    Baujahr
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'driverName'}
                                    direction={sortConfig.key === 'driverName' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('driverName')}
                                >
                                    Fahrer
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortConfig.key === 'leaseEndDate'}
                                    direction={sortConfig.key === 'leaseEndDate' ? sortConfig.direction : 'asc'}
                                    onClick={() => handleSort('leaseEndDate')}
                                >
                                    Leasing Ende
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Aktionen</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {vehicles.map((vehicle) => (
                            <TableRow key={vehicle.id}>
                                <TableCell>
                                    <Typography variant="body2" fontWeight="bold">
                                        {vehicle.licensePlate}
                                    </Typography>
                                </TableCell>
                                <TableCell>{vehicle.brand}</TableCell>
                                <TableCell>{vehicle.model}</TableCell>
                                <TableCell>{vehicle.year}</TableCell>
                                <TableCell>
                                    {vehicle.driverName ? (
                                        <div>
                                            <Typography variant="body2">{vehicle.driverName}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {vehicle.driverEmail}
                                            </Typography>
                                        </div>
                                    ) : (
                                        <Chip label="Nicht zugewiesen" color="default" size="small" />
                                    )}
                                </TableCell>
                                <TableCell>
                                    {vehicle.leaseEndDate ?
                                        dayjs(vehicle.leaseEndDate).format('DD.MM.YYYY') :
                                        '-'
                                    }
                                </TableCell>
                                <TableCell>
                                    {getLeaseStatusChip(vehicle.leaseEndDate)}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        size="small"
                                        onClick={() => onEdit && onEdit(vehicle)}
                                        color="primary"
                                    >
                                        <Edit />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleDelete(vehicle.id)}
                                        color="error"
                                    >
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default VehicleList;