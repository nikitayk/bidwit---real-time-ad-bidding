import express from 'express';
import { generateMockAnalytics } from '../utils/mockData';

const router = express.Router();

// Get analytics data
router.get('/', (req, res) => {
  const { timeRange } = req.query;
  const analyticsData = generateMockAnalytics(timeRange as string);
  res.json(analyticsData);
});

export default router; 