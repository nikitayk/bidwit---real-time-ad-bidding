import express from 'express';

const router = express.Router();

// Mock settings data
let settings = {
  notifications: {
    email: true,
    slack: false,
    bidAlerts: true,
    budgetAlerts: true,
  },
  bidding: {
    maxBidAmount: 1000,
    autoBidding: true,
    bidStrategy: 'balanced',
  },
  security: {
    twoFactorAuth: false,
    apiKeyExpiration: 30,
    ipWhitelist: [],
  },
  billing: {
    autoRecharge: true,
    minimumBalance: 1000,
    paymentMethod: 'credit_card',
  },
};

// Get settings
router.get('/', (req, res) => {
  res.json(settings);
});

// Update settings
router.put('/', (req, res) => {
  settings = { ...settings, ...req.body };
  res.json(settings);
});

export default router; 