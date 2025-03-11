const express = require('express');
const profileRoutes = require('./api/profiles');

const router = express.Router();

// Routes de profil
router.use('/profiles', profileRoutes);

module.exports = router; 