const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Store emergencies in memory (in production, use a database)
let emergencies = [];

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Emergency Alert API is running!' });
});

// Receive emergency alert
app.post('/api/emergency', (req, res) => {
  const { type, location, address, timestamp } = req.body;
  
  const emergency = {
    id: Date.now(),
    type,
    location,
    address,
    timestamp: timestamp || new Date().toISOString(),
    status: 'pending'
  };
  
  emergencies.push(emergency);
  
  console.log('🚨 New Emergency Alert:', emergency);
  
  // In a real app, you would:
  // 1. Send SMS to emergency contacts
  // 2. Notify emergency services
  // 3. Store in database
  
  res.json({ 
    success: true, 
    message: 'Emergency alert received and logged',
    alertId: emergency.id 
  });
});

// Get all emergencies (for admin dashboard)
app.get('/api/emergencies', (req, res) => {
  res.json(emergencies);
});

// Get emergency by ID
app.get('/api/emergency/:id', (req, res) => {
  const emergency = emergencies.find(e => e.id === parseInt(req.params.id));
  if (!emergency) {
    return res.status(404).json({ error: 'Emergency not found' });
  }
  res.json(emergency);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    emergenciesCount: emergencies.length 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚨 Emergency API server running on port ${PORT}`);
  console.log(`📍 Access at: http://localhost:${PORT}`);
  console.log(`📊 API endpoints:`);
  console.log(`   GET  /              - Server status`);
  console.log(`   GET  /api/health    - Health check`);
  console.log(`   POST /api/emergency - Submit emergency`);
  console.log(`   GET  /api/emergencies - List all emergencies`);
});
