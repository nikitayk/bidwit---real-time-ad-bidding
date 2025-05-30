import express, { Request, Response, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router: Router = express.Router();

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  targetCPA?: number;
}

// In-memory storage for campaigns (replace with database in production)
let campaigns: Campaign[] = [
  {
    id: uuidv4(),
    name: 'Sample Campaign',
    status: 'active',
    budget: 1000,
    spent: 250,
    impressions: 5000,
    clicks: 150,
    startDate: '2024-03-01',
    endDate: '2024-04-01'
  }
];

// Get all campaigns
router.get('/', (_req: Request, res: Response): void => {
  try {
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching campaigns' });
  }
});

interface GetCampaignParams {
  id: string;
}

// Get a specific campaign
router.get<GetCampaignParams>('/:id', (req: Request<GetCampaignParams>, res: Response): void => {
  const campaign = campaigns.find(c => c.id === req.params.id);
  if (!campaign) {
    res.status(404).json({ message: 'Campaign not found' });
    return;
  }
  res.json(campaign);
});

interface CreateCampaignBody {
  name: string;
  budget: number;
  targetCPA: number;
  startDate: string;
  endDate: string;
}

// Create a new campaign
router.post<{}, {}, CreateCampaignBody>('/', (req: Request<{}, {}, CreateCampaignBody>, res: Response): void => {
  try {
    const { name, budget, targetCPA, startDate, endDate } = req.body;

    // Validate required fields
    if (!name || !budget || !targetCPA || !startDate || !endDate) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }

    const newCampaign: Campaign = {
      id: uuidv4(),
      name,
      status: 'active',
      budget: Number(budget),
      spent: 0,
      impressions: 0,
      clicks: 0,
      startDate,
      endDate,
      targetCPA: Number(targetCPA)
    };

    campaigns.push(newCampaign);
    res.status(201).json(newCampaign);
  } catch (error) {
    res.status(500).json({ message: 'Error creating campaign' });
  }
});

interface UpdateCampaignParams {
  id: string;
}

type UpdateCampaignBody = Partial<Omit<Campaign, 'id'>>;

// Update a campaign
router.put<UpdateCampaignParams, {}, UpdateCampaignBody>(
  '/:id',
  (req: Request<UpdateCampaignParams, {}, UpdateCampaignBody>, res: Response): void => {
    const index = campaigns.findIndex(c => c.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    campaigns[index] = { ...campaigns[index], ...req.body };
    res.json(campaigns[index]);
  }
);

interface DeleteCampaignParams {
  id: string;
}

// Delete a campaign
router.delete<DeleteCampaignParams>('/:id', (req: Request<DeleteCampaignParams>, res: Response): void => {
  try {
    const { id } = req.params;
    const campaignIndex = campaigns.findIndex(c => c.id === id);

    if (campaignIndex === -1) {
      res.status(404).json({ message: 'Campaign not found' });
      return;
    }

    campaigns = campaigns.filter(c => c.id !== id);
    res.status(200).json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting campaign' });
  }
});

export default router; 