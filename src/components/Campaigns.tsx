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
      </div>

      {/* New Campaign Modal */}
      {showNewCampaign && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-cyber-darker p-6 rounded-lg border-2 border-white/20 w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-6">Create New Campaign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-base font-medium text-white mb-2">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={newCampaign.name}
                  onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Enter campaign name"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-white mb-2">
                  Budget (USD)
                </label>
                <input
                  type="number"
                  value={newCampaign.budget}
                  onChange={(e) => setNewCampaign({ ...newCampaign, budget: parseFloat(e.target.value) })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Enter budget amount"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-white mb-2">
                  Target CPA
                </label>
                <input
                  type="number"
                  value={newCampaign.targetCPA}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetCPA: parseFloat(e.target.value) })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                  placeholder="Enter target CPA"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-white mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={newCampaign.startDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-white mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={newCampaign.endDate}
                  onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                  className="block w-full px-4 py-3 bg-cyber-dark border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/50"
                />
              </div>
              <div className="flex justify-end space-x-4 mt-6">
                <button
                  onClick={() => setShowNewCampaign(false)}
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