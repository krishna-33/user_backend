const express = require('express');
const userRoutes = require('./user');
const authRoutes = require("./auth");

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

module.exports = router;