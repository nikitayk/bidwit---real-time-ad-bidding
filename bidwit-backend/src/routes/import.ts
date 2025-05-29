import express, { Request, Response } from 'express';
import multer from 'multer';
import { promises as fs } from 'fs';
import path from 'path';
import { processLine } from '../utils/processData';

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
    cb(null, uploadsDir);
  },
  filename: function (req: Express.Request, file: Express.Multer.File, cb: Function) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req: Express.Request, file: Express.Multer.File, cb: Function) => {
    if (file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt files are allowed'));
    }
  }
});

interface ImportProgress {
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  completed: boolean;
  error: string | null;
  data: any[];
}

// Store import progress
let importProgress: ImportProgress = {
  totalRows: 0,
  processedRows: 0,
  successfulRows: 0,
  failedRows: 0,
  completed: false,
  error: null,
  data: []
};

// Upload and process file
router.post('/', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Reset progress
    importProgress = {
      totalRows: 0,
      processedRows: 0,
      successfulRows: 0,
      failedRows: 0,
      completed: false,
      error: null,
      data: []
    };

    // Read file content
    const fileContent = await fs.readFile(req.file.path, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    importProgress.totalRows = lines.length;

    // Process file immediately instead of background
    try {
      for (const line of lines) {
        if (line.trim()) {
          const processedData = await processLine(line.trim());
          importProgress.data.push(processedData);
          importProgress.successfulRows++;
        }
        importProgress.processedRows++;
      }
      importProgress.completed = true;

      return res.json({
        success: true,
        message: 'File processed successfully',
        data: {
          totalRows: importProgress.totalRows,
          processedRows: importProgress.processedRows,
          successfulRows: importProgress.successfulRows,
          failedRows: importProgress.failedRows,
          data: importProgress.data
        }
      });
    } catch (error) {
      importProgress.error = error instanceof Error ? error.message : 'Unknown error';
      importProgress.completed = true;
      
      return res.status(500).json({
        success: false,
        error: importProgress.error
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to process file'
    });
  }
});

// Get import progress
router.get('/progress', (req: Request, res: Response) => {
  return res.json({
    success: true,
    data: importProgress
  });
});

export default router; 