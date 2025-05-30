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
    <div className="bg-cyber-darker p-6 rounded-lg border border-white/20">
      <h2 className="text-lg font-bold tracking-wider text-white mb-6">
        Campaign Filters
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3">
          <label className="block text-base font-medium text-white">
            Select Campaign
          </label>
          <select
            value={selectedCampaign}
            onChange={handleCampaignChange}
            className="w-full px-4 py-3 rounded-lg text-base"
          >
            {campaigns.map(campaign => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-3">
          <label className="block text-base font-medium text-white">
            Select Date Range
          </label>
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
            placeholderText="Click to select dates"
            dateFormat="yyyy/MM/dd"
            wrapperClassName="w-full"
            className="w-full px-4 py-3 rounded-lg text-base"
            showPopperArrow={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CampaignFilter; 