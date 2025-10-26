const express = require('express');
const router = express.Router();

// Store emergencies in memory
let emergencies = [];

// Report new emergency
router.post('/', (req, res) => {
  try {
    const { type, location, phoneNumber, description } = req.body;
    
    const newEmergency = {
      id: Date.now().toString(),
      type,
      location,
      phoneNumber: phoneNumber || 'unknown',
      description: description || 'No description',
      timestamp: new Date().toISOString(),
      status: 'reported'
    };
    
    emergencies.push(newEmergency);
    
    console.log('🚨 New Emergency Reported:', newEmergency);
    
    res.json({
      success: true,
      message: 'Emergency reported to Delta State authorities',
      emergency: newEmergency
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to report emergency'
    });
  }
});

// Get all emergencies
router.get('/', (req, res) => {
  res.json({
    success: true,
    emergencies: emergencies
  });
});

// Get emergencies by phone number
router.get('/user/:phoneNumber', (req, res) => {
  const userEmergencies = emergencies.filter(
    emergency => emergency.phoneNumber === req.params.phoneNumber
  );
  
  res.json({
    success: true,
    emergencies: userEmergencies
  });
});

module.exports = router;
