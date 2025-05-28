import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CampaignFilterProps {
  onFilterChange: (filters: {
    campaign: string;
    dateRange: [Date | null, Date | null];
  }) => void;
}

const CampaignFilter: React.FC<CampaignFilterProps> = ({ onFilterChange }) => {
  const [selectedCampaign, setSelectedCampaign] = useState('summer-2025');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [startDate, endDate] = dateRange;

  const campaigns = [
    { id: 'summer-2025', name: 'Summer Promotion 2025' },
    { id: 'winter-2024', name: 'Winter Sale 2024' },
    { id: 'spring-2025', name: 'Spring Launch 2025' },
  ];

  const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCampaign(e.target.value);
    onFilterChange({ campaign: e.target.value, dateRange });
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);
    onFilterChange({ campaign: selectedCampaign, dateRange: update });
  };

  return (
    <div className="cyber-card p-6 rounded-lg">
      <h2 className="text-lg font-bold tracking-wider text-neon-blue neon-text mb-4">
        CAMPAIGN FILTERS
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            CAMPAIGN
          </label>
          <select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200"
          >
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            DATE RANGE
          </label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            className="w-full bg-cyber-darker border border-neon-blue/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-neon-blue focus:ring-1 focus:ring-neon-blue transition-all duration-200"
            placeholderText="Select date range"
            dateFormat="yyyy/MM/dd"
            wrapperClassName="w-full"
            calendarClassName="cyber-calendar"
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignFilter; 