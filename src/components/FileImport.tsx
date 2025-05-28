import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';
import { useData } from '../context/DataContext';

interface BidData {
  timestamp: number;
  adId: string;
  bidPrice: number;
  ctr: number;
  isWon: boolean;
  campaign: string;
  executionTime: number;
  performance: number;
}

// Smaller chunks and batches for smoother processing
const CHUNK_SIZE = 100;
const BATCH_SIZE = 1000;
const MAX_ROWS = 10000;
const UPDATE_INTERVAL = 100;

const FileImport: React.FC = () => {
  const { importData } = useData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState<string | null>(null);
  const [worker, setWorker] = useState<Worker | null>(null);

  // Initialize Web Worker
  useEffect(() => {
    const workerCode = `
      const parseTimestamp = (timestamp) => {
        if (timestamp.length === 17) {
          return Date.UTC(
            parseInt(timestamp.slice(0, 4)),
            parseInt(timestamp.slice(4, 6)) - 1,
            parseInt(timestamp.slice(6, 8)),
            parseInt(timestamp.slice(8, 10)),
            parseInt(timestamp.slice(10, 12)),
            parseInt(timestamp.slice(12, 14)),
            parseInt(timestamp.slice(14))
          );
        }
        throw new Error('Invalid timestamp format');
      };

      const parseLine = (line) => {
        const parts = line.split(',').map(p => p.trim());
        if (parts.length !== 5) return null;

        const [timestamp, ad_id, bid_price, ctr, win_status] = parts;
        
        if (!timestamp || timestamp.length !== 17) return null;
        
        const bidPrice = Number(bid_price);
        const parsedCTR = Number(ctr);
        
        if (isNaN(bidPrice) || isNaN(parsedCTR)) return null;

        return {
          timestamp: parseTimestamp(timestamp),
          adId: ad_id,
          bidPrice,
          ctr: parsedCTR,
          isWon: win_status === '5' || win_status === '1',
          campaign: ad_id || 'Default Campaign',
          executionTime: Math.random() * 100,
          performance: Math.random() * 0.5 + 0.5 // Random performance between 0.5 and 1.0
        };
      };

      self.onmessage = function(e) {
        const { lines, chunkSize, maxRows } = e.data;
        const result = [];
        const totalLines = lines.length;
        const startIndex = Math.max(0, totalLines - maxRows);
        
        for (let i = startIndex; i < totalLines; i += chunkSize) {
          const chunk = [];
          const endIndex = Math.min(i + chunkSize, totalLines);
          
          for (let j = i; j < endIndex; j++) {
            const line = lines[j].trim();
            if (!line) continue;
            
            try {
              const parsed = parseLine(line);
              if (parsed) chunk.push(parsed);
            } catch (err) {
              // Skip invalid lines silently
            }
          }
          
          if (chunk.length > 0) {
            self.postMessage({
              type: 'chunk',
              data: chunk,
              progress: Math.round(((endIndex - startIndex) / Math.min(maxRows, totalLines - startIndex)) * 100)
            });
          }
        }
        
        self.postMessage({ type: 'done' });
      };
    `;

    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerUrl = URL.createObjectURL(blob);
    const newWorker = new Worker(workerUrl);
    setWorker(newWorker);

    return () => {
      newWorker.terminate();
      URL.revokeObjectURL(workerUrl);
    };
  }, []);

  // Debounced progress update
  const updateProgress = useCallback((value: number) => {
    requestAnimationFrame(() => setProgress(value));
  }, []);

  const processFile = useCallback(async (text: string) => {
    if (!worker) return;

    const lines = text.split('\n');
    const totalLines = lines.length;
    let processedBatch: BidData[] = [];
    let lastUpdateTime = Date.now();
    let totalProcessed = 0;

    return new Promise((resolve, reject) => {
      worker.onmessage = async (e) => {
        if (e.data.type === 'chunk') {
          processedBatch.push(...e.data.data);
          totalProcessed += e.data.data.length;

          const now = Date.now();
          if (now - lastUpdateTime > UPDATE_INTERVAL) {
            updateProgress(e.data.progress);
            setStats(`Processing row ${totalProcessed.toLocaleString()} of ${Math.min(MAX_ROWS, totalLines).toLocaleString()}`);
            lastUpdateTime = now;
          }

          if (processedBatch.length >= BATCH_SIZE) {
            try {
              await importData(processedBatch);
              processedBatch = [];
              // Add a small delay to prevent UI freezing
              await new Promise(resolve => setTimeout(resolve, 50));
            } catch (err) {
              reject(err);
            }
          }
        } else if (e.data.type === 'done') {
          if (processedBatch.length > 0) {
            try {
              await importData(processedBatch);
              resolve(undefined);
            } catch (err) {
              reject(err);
            }
          } else {
            resolve(undefined);
          }
        }
      };

      worker.onerror = (error) => {
        reject(error);
      };

      try {
        worker.postMessage({
          lines,
          chunkSize: CHUNK_SIZE,
          maxRows: MAX_ROWS
        });
      } catch (err) {
        reject(new Error('Failed to start processing. The file might be too large.'));
      }
    });
  }, [worker, importData, updateProgress]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsLoading(true);
    setError(null);
    setProgress(0);
    setStats(null);

    try {
      const text = await file.text();
      const totalLines = text.split('\n').length;
      
      if (totalLines > MAX_ROWS) {
        console.warn(`File contains ${totalLines.toLocaleString()} rows. Only the most recent ${MAX_ROWS.toLocaleString()} will be displayed.`);
        setStats(`Loading last ${MAX_ROWS.toLocaleString()} rows from ${totalLines.toLocaleString()} total rows...`);
      }

      await processFile(text);
      setStats(`Successfully imported ${Math.min(MAX_ROWS, totalLines).toLocaleString()} most recent rows`);

    } catch (err) {
      console.error('Import failed:', err);
      setError(err instanceof Error ? err.message : 'Failed to import file. Please check the format.');
    } finally {
      setIsLoading(false);
      setProgress(0);
    }
  }, [processFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt', '.csv'],
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="w-64">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-neon-blue bg-neon-blue/10' 
            : 'border-gray-600 hover:border-neon-blue/50 hover:bg-cyber-darker'
          }
        `}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto h-6 w-6 mb-2 text-gray-400" />
        {isLoading ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-neon-blue"></div>
              <p className="text-gray-400 text-sm">Importing...</p>
            </div>
            {progress > 0 && (
              <>
                <div className="w-full bg-cyber-darker rounded-full h-1.5">
                  <div
                    className="bg-neon-blue h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {stats && (
                  <p className="text-gray-400 text-xs mt-1">{stats}</p>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-400 text-sm mb-1">
              {isDragActive
                ? 'Drop the file here'
                : 'Drop data file or click'}
            </p>
            <p className="text-gray-500 text-xs">
              .txt or .csv format
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-2 p-2 bg-neon-pink/10 border border-neon-pink rounded-lg">
          <p className="text-neon-pink text-xs">{error}</p>
        </div>
      )}
    </div>
  );
};

export default FileImport; 