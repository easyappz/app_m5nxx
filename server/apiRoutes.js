const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Define Calculation Schema
const CalculationSchema = new mongoose.Schema({
  expression: { type: String, required: true },
  result: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Define Calculation Model
const Calculation = mongoose.model('Calculation', CalculationSchema);

// GET /api/hello
router.get('/hello', (req, res) => {
  res.json({ message: 'Hello from API!' });
});

// GET /api/status
router.get('/status', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// POST /api/calculations - Save a new calculation
router.post('/calculations', async (req, res) => {
  try {
    const { expression, result } = req.body;
    
    if (!expression || result === undefined) {
      return res.status(400).json({ error: 'Expression and result are required' });
    }

    const newCalculation = new Calculation({ expression, result });
    const savedCalculation = await newCalculation.save();

    res.status(201).json(savedCalculation);
  } catch (error) {
    console.error('Error saving calculation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/calculations - Retrieve calculation history
router.get('/calculations', async (req, res) => {
  try {
    const calculations = await Calculation.find().sort({ timestamp: -1 }).limit(50);
    res.json(calculations);
  } catch (error) {
    console.error('Error fetching calculations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;