import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import analyticsRoutes from './routes/analytics';
import campaignsRoutes from './routes/campaigns';
import settingsRoutes from './routes/settings';
import importRoutes from './routes/import';

const app: Express = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
try {
  require('fs').mkdirSync(uploadsDir, { recursive: true });
} catch (error) {
  console.error('Failed to create uploads directory:', error);
}

// Routes
app.use('/api/analytics', analyticsRoutes);
app.use('/api/campaigns', campaignsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/import', importRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Handle 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 