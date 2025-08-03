import React, {useState} from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Add, List, Notifications } from '@mui/icons-material';
import VehicleList from './components/VehicleList';
import VehicleForm from './components/VehicleForm';
import ReminderList from './components/ReminderList';
import ReminderForm from './components/ReminderForm';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
  },
});

function App() {
const [formOpen, setFormOpen] = useState(false);
  const [reminderFormOpen, setReminderFormOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentView, setCurrentView] = useState('vehicles'); // 'vehicles' or 'reminders'

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setFormOpen(true);
  };

  const handleAddReminder = () => {
    setSelectedReminder(null);
    setReminderFormOpen(true);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormOpen(true);
  };

  const handleEditReminder = (reminder) => {
    setSelectedReminder(reminder);
    setReminderFormOpen(true);
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedVehicle(null);
  };

  const handleReminderFormClose = () => {
    setReminderFormOpen(false);
    setSelectedReminder(null);
  };

  const handleFormSave = () => {
    setRefreshKey(prev => prev + 1); // Liste neu laden
  };

  const showVehicles = () => {
    setCurrentView('vehicles');
  };

  const showReminders = () => {
    setCurrentView('reminders');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Fuhrpark Management
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<List />}
            onClick={showVehicles}
            variant={currentView === 'vehicles' ? 'outlined' : 'text'}
          >
            Fahrzeuge
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Notifications />}
            onClick={showReminders}
            variant={currentView === 'reminders' ? 'outlined' : 'text'}
          >
            Erinnerungen
          </Button>
          <Button 
            color="inherit" 
            startIcon={<Add />}
            onClick={currentView === 'vehicles' ? handleAddVehicle : handleAddReminder}
          >
            {currentView === 'vehicles' ? 'Fahrzeug hinzufügen' : 'Erinnerung hinzufügen'}
          </Button>
        </Toolbar>
      </AppBar>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {currentView === 'vehicles' && (
          <VehicleList 
            key={refreshKey}
            onEdit={handleEditVehicle}
            onDelete={handleFormSave}
          />
        )}
        {currentView === 'reminders' && (
          <ReminderList 
            key={refreshKey}
            onEdit={handleEditReminder}
            onDelete={handleFormSave}
          />
        )}
      </Container>

      <VehicleForm
        open={formOpen}
        onClose={handleFormClose}
        vehicle={selectedVehicle}
        onSave={handleFormSave}
      />

      <ReminderForm
        open={reminderFormOpen}
        onClose={handleReminderFormClose}
        reminder={selectedReminder}
        onSave={handleFormSave}
      />
    </ThemeProvider>
  );
}

export default App;