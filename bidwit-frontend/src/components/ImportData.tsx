import React, { useState, useRef, useEffect } from 'react';
import { ArrowUpTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ImportStats {
  totalRows: number;
  processedRows: number;
  successfulRows: number;
  failedRows: number;
  completed: boolean;
  error: string | null;
  data?: any[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: ImportStats;
}

const ImportData = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<ImportStats | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:3000/api/import', {
        method: 'POST',
        body: formData,
      });

      const result: ApiResponse = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to upload file');
      }

      if (result.data) {
        setImportStats(result.data);
        if (result.data.error) {
          setError(result.data.error);
        }
      }

      setIsProcessing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process file');
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.txt')) {
      setFile(droppedFile);
      processFile(droppedFile);
    } else {
      setError('Please upload a .txt file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.name.endsWith('.txt')) {
      setFile(selectedFile);
      processFile(selectedFile);
    } else {
      setError('Please upload a .txt file');
    }
  };

  const handleCancel = () => {
    setFile(null);
    setImportStats(null);
    setError(null);
    setIsProcessing(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-dark-text-primary">Import Data</h2>
        {(file || error) && (
          <button
            onClick={handleCancel}
            className="text-dark-text-secondary hover:text-dark-text-primary"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        )}
      </div>

      {!file && !error && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging
              ? 'border-primary-500 bg-primary-500 bg-opacity-10'
              : 'border-dark-border'
          }`}
        >
          <ArrowUpTrayIcon className="h-12 w-12 mx-auto text-dark-text-secondary" />
          <p className="mt-4 text-sm text-dark-text-secondary">
            Drag and drop your output.txt file here, or{' '}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-500 hover:text-primary-600"
            >
              browse
            </button>
          </p>
          <p className="mt-2 text-xs text-dark-text-secondary">
            Expected format: timestamp, ad_id, bid_price, ctr, win_status
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      )}

      {error && (
        <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4">
          <p className="text-sm text-red-500 font-medium">Error</p>
          <p className="text-sm text-red-400 mt-1">{error}</p>
          <button
            onClick={handleCancel}
            className="mt-2 text-sm text-red-500 hover:text-red-400"
          >
            Try Again
          </button>
        </div>
      )}

      {isProcessing && importStats && (
        <div className="space-y-4">
          <div className="h-2 bg-dark-bg-tertiary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-500 transition-all duration-500"
              style={{
                width: `${(importStats.processedRows / importStats.totalRows) * 100}%`,
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-dark-text-secondary">Processed</p>
              <p className="text-lg font-medium text-dark-text-primary">
                {importStats.processedRows} / {importStats.totalRows}
              </p>
            </div>
            <div>
              <p className="text-sm text-dark-text-secondary">Success Rate</p>
              <p className="text-lg font-medium text-dark-text-primary">
                {((importStats.successfulRows / importStats.totalRows) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {!isProcessing && importStats && importStats.completed && (
        <div className="bg-green-500 bg-opacity-10 border border-green-500 rounded-lg p-4">
          <p className="text-sm text-green-500 font-medium">Import Complete</p>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-green-400">
              Successfully processed {importStats.successfulRows} of {importStats.totalRows} rows
            </p>
            {importStats.failedRows > 0 && (
              <p className="text-sm text-yellow-500">
                Failed to process {importStats.failedRows} rows
              </p>
            )}
          </div>
          <button
            onClick={handleCancel}
            className="mt-3 text-sm text-green-500 hover:text-green-400"
          >
            Import Another File
          </button>
        </div>
      )}
    </div>
  );
};

export default ImportData; 