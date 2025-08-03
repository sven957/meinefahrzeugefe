import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Tabs,
  Tab,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Button
} from '@mui/material';
import { AccountCircle, DirectionsCar, Notifications, Dashboard as DashboardIcon } from '@mui/icons-material';
import Login from './components/Login';
import Register from './components/Register';
import VehicleList from './components/VehicleList';
import VehicleForm from './components/VehicleForm';
import ReminderList from './components/ReminderList';
import ReminderForm from './components/ReminderForm';
import { authService } from './services/authService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  
  // Vehicle Management State
  const [vehicleFormOpen, setVehicleFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleListKey, setVehicleListKey] = useState(0);
  
  // Reminder Management State
  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderListKey, setReminderListKey] = useState(0);

  const handleLogin = (response) => {
    setIsAuthenticated(true);
    setUser({
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role
    });
  };

  const handleRegister = (response) => {
    setIsAuthenticated(true);
    setUser({
      username: response.username,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      role: response.role
    });
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setIsAuthenticated(false);
    setUser(null);
    setCurrentTab(0);
    setAnchorEl(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Vehicle Management Functions
  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setVehicleFormOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleFormOpen(true);
  };

  const handleVehicleSave = () => {
    setVehicleListKey(prev => prev + 1);
    setVehicleFormOpen(false);
    setSelectedVehicle(null);
  };

  const handleVehicleDelete = () => {
    setVehicleListKey(prev => prev + 1);
  };

  // Reminder Management Functions
  const handleAddReminder = () => {
    setSelectedReminder(null);
    setReminderFormOpen(true);
  };

  const handleEditReminder = (reminder) => {
    setSelectedReminder(reminder);
    setReminderFormOpen(true);
  };

  const handleReminderSave = () => {
    setReminderListKey(prev => prev + 1);
    setReminderFormOpen(false);
    setSelectedReminder(null);
  };

  const handleReminderDelete = () => {
    setReminderListKey(prev => prev + 1);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {showRegister ? (
          <Register
            onRegister={handleRegister}
            onSwitchToLogin={() => setShowRegister(false)}
          />
        ) : (
          <Login
            onLogin={handleLogin}
            onSwitchToRegister={() => setShowRegister(true)}
          />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <DirectionsCar sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Fuhrpark Management System
            </Typography>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Willkommen, {user?.firstName} {user?.lastName}
            </Typography>
            <IconButton
              size="large"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>Abmelden</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg">
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs value={currentTab} onChange={handleTabChange}>
              <Tab icon={<DashboardIcon />} label="Dashboard" />
              <Tab icon={<DirectionsCar />} label="Fahrzeuge" />
              <Tab icon={<Notifications />} label="Erinnerungen" />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Typography variant="h4" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Hier finden Sie eine Übersicht über Ihre Fahrzeuge und anstehende Aufgaben.
            </Typography>
            <Box sx={{ mt: 3, display: 'grid', gap: 2 }}>
              <Typography variant="h6">Willkommen im Fuhrpark Management System!</Typography>
              <Typography variant="body2">
                Verwenden Sie die Registerkarten oben, um zwischen Fahrzeugen und Erinnerungen zu navigieren.
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                Fahrzeuge
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleAddVehicle}
                startIcon={<DirectionsCar />}
              >
                Fahrzeug hinzufügen
              </Button>
            </Box>
            <VehicleList
              key={vehicleListKey}
              onEdit={handleEditVehicle}
              onDelete={handleVehicleDelete}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h4" gutterBottom>
                Erinnerungen
              </Typography>
              <Button 
                variant="contained" 
                onClick={handleAddReminder}
                startIcon={<Notifications />}
              >
                Erinnerung hinzufügen
              </Button>
            </Box>
            <ReminderList
              key={reminderListKey}
              onEdit={handleEditReminder}
              onDelete={handleReminderDelete}
            />
          </TabPanel>
        </Container>

        {/* Vehicle Form Dialog */}
        <VehicleForm
          open={vehicleFormOpen}
          onClose={() => setVehicleFormOpen(false)}
          vehicle={selectedVehicle}
          onSave={handleVehicleSave}
        />

        {/* Reminder Form Dialog */}
        <ReminderForm
          open={reminderFormOpen}
          onClose={() => setReminderFormOpen(false)}
          reminder={selectedReminder}
          onSave={handleReminderSave}
        />
      </Box>
    </ThemeProvider>
  );
}

export default App;