const express = require('express');
const router = express.Router();

// Store users in memory
let users = [];

// Register user
router.post('/register', (req, res) => {
  try {
    const { phoneNumber, nationalId } = req.body;
    
    if (!phoneNumber || !nationalId) {
      return res.status(400).json({
        success: false,
        message: 'Phone number and national ID are required'
      });
    }
    
    // Check if user already exists
    const existingUser = users.find(user => user.phoneNumber === phoneNumber);
    if (existingUser) {
      return res.json({
        success: true,
        message: 'Welcome back!',
        user: existingUser
      });
    }
    
    const newUser = {
      id: Date.now().toString(),
      phoneNumber,
      nationalId,
      isVerified: false,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    console.log('👤 New User Registered:', newUser);
    
    res.json({
      success: true,
      message: 'Registration successful',
      user: newUser
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed'
    });
  }
});

// Verify phone
router.post('/verify-phone', (req, res) => {
  const { phoneNumber, code } = req.body;
  
  const user = users.find(user => user.phoneNumber === phoneNumber);
  if (user) {
    user.isVerified = true;
    user.verifiedAt = new Date().toISOString();
    
    res.json({
      success: true,
      message: 'Phone verified successfully',
      user
    });
  } else {
    res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
});

// Get all users (for admin)
router.get('/users', (req, res) => {
  res.json({
    success: true,
    users: users
  });
});

module.exports = router;
