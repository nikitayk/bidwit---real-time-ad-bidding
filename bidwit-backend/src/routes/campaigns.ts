import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Mock database
let campaigns = [
  {
    id: '1',
    name: 'Summer Sale 2024',
    status: 'active',
    budget: 10000,
    spent: 3500,
    startDate: '2024-06-01',
    endDate: '2024-08-31',
    targetCPA: 2.5,
    impressions: 150000,
    clicks: 7500,
  },
  {
    id: '2',
    name: 'Back to School 2024',
    status: 'paused',
    budget: 15000,
    spent: 5000,
    startDate: '2024-08-01',
    endDate: '2024-09-15',
    targetCPA: 3.0,
    impressions: 200000,
    clicks: 10000,
  },
];

// Get all campaigns
router.get('/', (req, res) => {
  res.json(campaigns);
});

// Get a specific campaign
router.get('/:id', (req, res) => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  res.json(campaign);
});

// Create a new campaign
router.post('/', (req, res) => {
  const newCampaign = {
    id: uuidv4(),
    ...req.body,
    status: 'active',
    spent: 0,
    impressions: 0,
    clicks: 0,
  };
  campaigns.push(newCampaign);
  res.status(201).json(newCampaign);
});

// Update a campaign
router.put('/:id', (req, res) => {
  const index = campaigns.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  campaigns[index] = { ...campaigns[index], ...req.body };
  res.json(campaigns[index]);
});

// Delete a campaign
router.delete('/:id', (req, res) => {
  const index = campaigns.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  campaigns = campaigns.filter(c => c.id !== req.params.id);
  res.status(204).send();
});

export default router; 