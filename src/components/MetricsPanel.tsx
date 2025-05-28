import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface MetricsPanelProps {
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    ctr: number;
    cvr: number;
    cpc: number;
    bidsWon: number;
    bidsLost: number;
    budgetUsed: number;
    budgetTotal: number;
  };
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ metrics }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toFixed(1);
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`;
  };

  const MetricCard = ({ title, value, subtitle, type = 'default' }: { 
    title: string; 
    value: string; 
    subtitle?: string;
    type?: 'default' | 'success' | 'danger' | 'money';
  }) => {
    const getStyles = () => {
      switch (type) {
        case 'success':
          return 'border-money-green text-money-green neon-text-money';
        case 'danger':
          return 'border-neon-pink text-neon-pink';
        case 'money':
          return 'border-money-green text-money-green neon-text-money';
        default:
          return 'border-neon-blue text-neon-blue neon-text';
      }
    };

    return (
      <div className={`cyber-card p-6 rounded-lg neon-border ${getStyles()}`}>
        <h3 className="text-sm font-medium text-gray-400 mb-2">{title}</h3>
        <p className="text-3xl font-bold tracking-wider">
          {value}
        </p>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
        )}
      </div>
    );
  };

  const budgetPercentage = (metrics.budgetUsed / metrics.budgetTotal) * 100;
  const winRate = (metrics.bidsWon / (metrics.bidsWon + metrics.bidsLost)) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <MetricCard
        title="TOTAL IMPRESSIONS"
        value={formatNumber(metrics.impressions)}
        type="default"
      />
      <MetricCard
        title="CLICK-THROUGH RATE"
        value={formatPercentage(metrics.ctr)}
        subtitle={`${formatNumber(metrics.clicks)} clicks`}
        type="success"
      />
      <MetricCard
        title="CONVERSION RATE"
        value={formatPercentage(metrics.cvr)}
        subtitle={`${formatNumber(metrics.conversions)} conversions`}
        type="success"
      />
      <MetricCard
        title="COST PER CLICK"
        value={formatCurrency(metrics.cpc)}
        type="money"
      />
      <MetricCard
        title="BIDS WON"
        value={formatNumber(metrics.bidsWon)}
        subtitle={`${formatPercentage(winRate)} win rate`}
        type="success"
      />
      <MetricCard
        title="BIDS LOST"
        value={formatNumber(metrics.bidsLost)}
        type="danger"
      />
      <MetricCard
        title="BUDGET USED"
        value={formatCurrency(metrics.budgetUsed)}
        subtitle={`${formatPercentage(budgetPercentage)} of total`}
        type="money"
      />
      <MetricCard
        title="BUDGET REMAINING"
        value={formatCurrency(metrics.budgetTotal - metrics.budgetUsed)}
        type="money"
      />
      
      <div className="col-span-full cyber-card p-6 rounded-lg">
        <h3 className="text-sm font-medium text-gray-400 mb-4">BUDGET ALLOCATION</h3>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-money-green/20 text-money-green neon-text-money">
                {budgetPercentage.toFixed(1)}%
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-neon-blue neon-text">
                {formatCurrency(metrics.budgetUsed)} / {formatCurrency(metrics.budgetTotal)}
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-cyber-darker">
            <div
              style={{ width: `${budgetPercentage}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-money-green transition-all duration-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsPanel; 