const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data storage paths
const appointmentsFile = path.join(__dirname, 'data', 'appointments.json');
const doctorsFile = path.join(__dirname, 'data', 'doctors.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize data files if they don't exist
if (!fs.existsSync(appointmentsFile)) {
  fs.writeFileSync(appointmentsFile, JSON.stringify([]));
}

if (!fs.existsSync(doctorsFile)) {
  const initialDoctors = [
    { id: 1, name: 'Dr. Sarah Johnson', specialty: 'Cardiology', avatar: '/api/placeholder/80/80' },
    { id: 2, name: 'Dr. Michael Chen', specialty: 'Orthopedics', avatar: '/api/placeholder/80/80' },
    { id: 3, name: 'Dr. Emily Rodriguez', specialty: 'Dermatology', avatar: '/api/placeholder/80/80' },
    { id: 4, name: 'Dr. James Wilson', specialty: 'Neurology', avatar: '/api/placeholder/80/80' },
    { id: 5, name: 'Dr. Lisa Park', specialty: 'Pediatrics', avatar: '/api/placeholder/80/80' },
    { id: 6, name: 'Dr. David Thompson', specialty: 'Internal Medicine', avatar: '/api/placeholder/80/80' }
  ];
  fs.writeFileSync(doctorsFile, JSON.stringify(initialDoctors));
}

// Helper functions
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

const generateTimeSlots = (date) => {
  const slots = [];
  const startHour = 9;
  const endHour = 17;
  
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour}:00`);
    slots.push(`${hour}:30`);
  }
  
  return slots;
};

// API Routes

// Get hospital information
app.get('/api/hospital-info', (req, res) => {
  res.json({
    name: 'Elite Medical Center',
    tagline: 'Excellence in Healthcare',
    description: 'Our state-of-the-art private hospital provides world-class medical care with personalized attention. We offer comprehensive healthcare services with the latest technology and experienced medical professionals.',
    features: [
      'Board-certified specialists',
      'Advanced diagnostic equipment',
      'Personalized care plans',
      '24/7 emergency services',
      'Comfortable private rooms',
      'Comprehensive health screenings'
    ],
    contact: {
      phone: '+1 (555) 123-4567',
      email: 'appointments@elitemedical.com',
      address: '123 Medical Plaza, Health City, HC 12345'
    }
  });
});

// Get all doctors
app.get('/api/doctors', (req, res) => {
  const doctors = readData(doctorsFile);
  res.json(doctors);
});

// Get available time slots for a specific date and doctor
app.get('/api/available-slots', (req, res) => {
  const { date, doctorId } = req.query;
  
  if (!date || !doctorId) {
    return res.status(400).json({ error: 'Date and doctor ID are required' });
  }
  
  const appointments = readData(appointmentsFile);
  const allSlots = generateTimeSlots(date);
  
  // Filter out booked slots
  const bookedSlots = appointments
    .filter(apt => apt.date === date && apt.doctorId === parseInt(doctorId))
    .map(apt => apt.time);
  
  const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot));
  
  res.json(availableSlots);
});

// Book an appointment
app.post('/api/appointments', (req, res) => {
  const { patientName, email, phone, date, time, doctorId, reason } = req.body;
  
  if (!patientName || !email || !phone || !date || !time || !doctorId || !reason) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const appointments = readData(appointmentsFile);
  
  // Check if slot is already booked
  const existingAppointment = appointments.find(
    apt => apt.date === date && apt.time === time && apt.doctorId === parseInt(doctorId)
  );
  
  if (existingAppointment) {
    return res.status(409).json({ error: 'This time slot is already booked' });
  }
  
  const newAppointment = {
    id: uuidv4(),
    patientName,
    email,
    phone,
    date,
    time,
    doctorId: parseInt(doctorId),
    reason,
    status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  
  appointments.push(newAppointment);
  writeData(appointmentsFile, appointments);
  
  res.status(201).json({
    message: 'Appointment booked successfully',
    appointment: newAppointment
  });
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  const { id } = req.params;
  const appointments = readData(appointmentsFile);
  const doctors = readData(doctorsFile);
  
  const appointment = appointments.find(apt => apt.id === id);
  
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }
  
  const doctor = doctors.find(doc => doc.id === appointment.doctorId);
  
  res.json({
    ...appointment,
    doctor: doctor || null
  });
});

// Clean up old appointments (run daily at midnight)
cron.schedule('0 0 * * *', () => {
  const appointments = readData(appointmentsFile);
  const today = new Date().toISOString().split('T')[0];
  
  const futureAppointments = appointments.filter(apt => apt.date >= today);
  writeData(appointmentsFile, futureAppointments);
  
  console.log('Cleaned up old appointments');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});