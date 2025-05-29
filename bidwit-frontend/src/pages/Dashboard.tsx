import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  ArrowDownTrayIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/24/outline';
import HelpModal from '../components/HelpModal';
import NFactor from '../components/NFactor';
import DashboardMetrics from '../components/DashboardMetrics';
import ImportGuide from '../components/ImportGuide';
import ImportData from '../components/ImportData';

function Dashboard() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedCampaign, setSelectedCampaign] = useState('summer2025');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isImportGuideOpen, setIsImportGuideOpen] = useState(false);
  const [nFactor, setNFactor] = useState(1.0);

  const campaigns = [
    { id: 'summer2025', name: 'Summer Promotion 2025' },
    { id: 'winter2025', name: 'Winter Campaign 2025' },
  ];

  // Export functionality
  const handleExport = (format: 'csv' | 'json') => {
    const data = format === 'csv' 
      ? 'timestamp,ad_id,bid_price,ctr,win_status\n'
      : JSON.stringify({ /* export data */ }, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bidwit-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      
      {/* Import Guide Modal */}
      <ImportGuide isOpen={isImportGuideOpen} onClose={() => setIsImportGuideOpen(false)} />

      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark-text-primary">Campaign Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsImportGuideOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-dark-border rounded-md text-sm font-medium text-dark-text-primary hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
            Import Guide
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="inline-flex items-center px-3 py-2 border border-dark-border rounded-md text-sm font-medium text-dark-text-primary hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            Export
          </button>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-dark-border rounded-md text-sm font-medium text-dark-text-primary hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Help
          </button>
        </div>
      </div>

      {/* Import Data Section */}
      <div className="bg-dark-bg-secondary rounded-lg p-6">
        <ImportData />
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-1">
            Campaign
          </label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-1">
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-1">
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <NFactor value={nFactor} onChange={setNFactor} />
        </div>
      </div>

      {/* Dashboard Metrics */}
      {startDate && endDate && (
        <DashboardMetrics
          campaignId={selectedCampaign}
          startDate={startDate}
          endDate={endDate}
        />
      )}
    </div>
  );
}

export default Dashboard; 