const express = require('express');
const router = express.Router();
const todoRoutes = require('./todos');

router.use('/', todoRoutes);

module.exports = router;
