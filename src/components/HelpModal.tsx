import React from 'react';
import { FiX } from 'react-icons/fi';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const sections = [
    {
      title: 'Getting Started',
      content: [
        'Welcome to BIDWIT - Your Real-Time Bidding Analytics Dashboard',
        'This platform helps you monitor, analyze, and optimize your digital advertising campaigns in real-time.',
      ],
    },
    {
      title: 'Data Import',
      content: [
        'Upload your campaign data using the "Import Data" button.',
        'Supported format: CSV or TXT file with columns:',
        '<timestamp>,<ad_id>,<bid_price>,<CTR>,<win_status>',
        'Example: 20130607000103501,88ea095ae6d01c3391bbba18a9601b36,300,6.000041961669922,5',
      ],
    },
    {
      title: 'N-Factor Explained',
      content: [
        'The N-Factor controls your bidding strategy aggressiveness:',
        '1-3: Conservative - Lower bids, higher ROI focus',
        '4-7: Balanced - Optimal for most campaigns',
        '8-10: Aggressive - Higher bids, maximizing reach',
      ],
    },
    {
      title: 'Real-Time Features',
      content: [
        'Live Console: Shows real-time bid outcomes',
        'Auto-updates: Dashboard refreshes every 2 seconds',
        'Performance Metrics: CTR, CVR, and win/loss ratios',
        'Budget Tracking: Real-time spend monitoring',
      ],
    },
    {
      title: 'Charts & Visualizations',
      content: [
        'CTR Trends: Click-through rate over time',
        'Bid Distribution: Price distribution analysis',
        'Win/Loss Ratio: Campaign performance tracking',
        'Interactive: Hover for detailed information',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="cyber-card rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden relative">
        <div className="p-6 border-b border-neon-blue/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-wider text-neon-blue neon-text">
              BIDWIT DOCUMENTATION
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-neon-blue transition-colors duration-200"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-bold text-money-green neon-text-money">
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.content.map((text, i) => (
                    <p key={i} className="text-gray-400">
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-neon-blue/30">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="cyber-button px-6 py-2 rounded-lg"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal; 