import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
}

interface NewCampaign {
  name: string;
  budget: number;
  targetCPA: number;
  startDate: string;
  endDate: string;
}

interface FormErrors {
  name?: string;
  budget?: string;
  targetCPA?: string;
  startDate?: string;
  endDate?: string;
}

const Campaigns: React.FC = () => {
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [newCampaign, setNewCampaign] = useState<NewCampaign>({
    name: '',
    budget: 0,
    targetCPA: 0,
    startDate: '',
    endDate: ''
  });

  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    let isValid = true;

    if (!newCampaign.name.trim()) {
      errors.name = 'Campaign name is required';
      isValid = false;
    }

    if (newCampaign.budget <= 0) {
      errors.budget = 'Budget must be greater than 0';
      isValid = false;
    }

    if (newCampaign.targetCPA <= 0) {
      errors.targetCPA = 'Target CPA must be greater than 0';
      isValid = false;
    }

    if (!newCampaign.startDate) {
      errors.startDate = 'Start date is required';
      isValid = false;
    }

    if (!newCampaign.endDate) {
      errors.endDate = 'End date is required';
      isValid = false;
    }

    if (newCampaign.startDate && newCampaign.endDate && 
        new Date(newCampaign.startDate) >= new Date(newCampaign.endDate)) {
      errors.endDate = 'End date must be after start date';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleCreateCampaign = () => {
    if (!validateForm()) {
      return;
    }
    // Add campaign creation logic here
    setShowNewCampaign(false);
    setFormErrors({});
  };

  const handleDeleteCampaign = (id: string) => {
    // Add campaign deletion logic here
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-500 text-white';
      case 'paused':
        return 'bg-amber-500 text-white';
      case 'completed':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-white">Loading campaigns...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-400 text-center">
          <p className="text-lg font-semibold mb-2">Error loading campaigns</p>
          <p className="text-sm opacity-80">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-white">Campaigns</h2>
        <button
          onClick={() => setShowNewCampaign(true)}
          className="inline-flex items-center px-6 py-3 bg-white text-cyber-darker text-base font-semibold rounded-lg hover:bg-white/90 transition-all duration-300"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          New Campaign
        </button>
      </div>

      {/* Campaign List */}
      <div className="bg-cyber-darker rounded-lg border-2 border-white/20 overflow-hidden">
        {campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="text-white/80 mb-4">No campaigns found</div>
            <button
              onClick={() => setShowNewCampaign(true)}
              className="inline-flex items-center px-6 py-3 bg-white text-cyber-darker text-base font-semibold rounded-lg hover:bg-white/90 transition-all duration-300"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Your First Campaign
            </button>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-white/20">
            <thead className="bg-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Performance
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-white">{campaign.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-white">${campaign.budget.toLocaleString()}</div>
                    <div className="text-sm text-white/80 mt-1">
                      Spent: ${campaign.spent.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-medium text-white">
                      {campaign.impressions.toLocaleString()} impressions
                    </div>
                    <div className="text-sm text-white/80 mt-1">
                      {campaign.clicks.toLocaleString()} clicks
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="date-text mb-1">
                      {new Date(campaign.startDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="date-text opacity-90">
                      {new Date(campaign.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      className="text-white hover:text-white/80 mr-4 transition-colors duration-200"
                      onClick={() => {/* Handle edit */}}
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="bg-cyber-darker p-6 rounded-lg border-2 border-white/20 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">Create New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="campaign-name" className="block text-base font-medium text-white mb-2">
                  Campaign Name
                </label>
                <input
                  id="campaign-name"
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Enter campaign name"
                  aria-invalid={!!formErrors.name}
                  aria-describedby={formErrors.name ? "name-error" : undefined}
                />
                {formErrors.name && (
                  <p id="name-error" className="mt-1 text-sm text-red-400">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label htmlFor="campaign-budget" className="block text-base font-medium text-white mb-2">
                  Budget (USD)
                </label>
                <input
                  id="campaign-budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseFloat(e.target.value) })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Enter budget amount"
                  aria-invalid={!!formErrors.budget}
                  aria-describedby={formErrors.budget ? "budget-error" : undefined}
                />
                {formErrors.budget && (
                  <p id="budget-error" className="mt-1 text-sm text-red-400">{formErrors.budget}</p>
                )}
              </div>

              <div>
                <label htmlFor="campaign-cpa" className="block text-base font-medium text-white mb-2">
                  Target CPA
                </label>
                <input
                  id="campaign-cpa"
                  type="number"
                  min="0"
                  step="0.01"
                  value={newCampaign.targetCPA}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetCPA: parseFloat(e.target.value) })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Enter target CPA"
                  aria-invalid={!!formErrors.targetCPA}
                  aria-describedby={formErrors.targetCPA ? "cpa-error" : undefined}
                />
                {formErrors.targetCPA && (
                  <p id="cpa-error" className="mt-1 text-sm text-red-400">{formErrors.targetCPA}</p>
                )}
              </div>

              <div>
                <label htmlFor="campaign-start-date" className="block text-base font-medium text-white mb-2">
                  Start Date
                </label>
                <input
                  id="campaign-start-date"
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  aria-invalid={!!formErrors.startDate}
                  aria-describedby={formErrors.startDate ? "start-date-error" : undefined}
                />
                {formErrors.startDate && (
                  <p id="start-date-error" className="mt-1 text-sm text-red-400">{formErrors.startDate}</p>
                )}
              </div>

              <div>
                <label htmlFor="campaign-end-date" className="block text-base font-medium text-white mb-2">
                  End Date
                </label>
                <input
                  id="campaign-end-date"
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  aria-invalid={!!formErrors.endDate}
                  aria-describedby={formErrors.endDate ? "end-date-error" : undefined}
                />
                {formErrors.endDate && (
                  <p id="end-date-error" className="mt-1 text-sm text-red-400">{formErrors.endDate}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowNewCampaign(false);
                    setFormErrors({});
                  }}
                  className="px-6 py-3 border-2 border-white/30 rounded-lg text-base font-medium text-white hover:bg-white/5 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCampaign}
                  className="px-6 py-3 bg-white text-cyber-darker text-base font-semibold rounded-lg hover:bg-white/90 transition-all duration-200"
                >
                  Create Campaign
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns; 