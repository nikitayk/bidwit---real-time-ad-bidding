import React, { useEffect } from 'react';
import { FiInfo, FiX } from 'react-icons/fi';
import { RiFileTextLine, RiInformationLine } from 'react-icons/ri';

interface ImportGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportGuide: React.FC<ImportGuideProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-2 md:p-4" onClick={handleBackdropClick}>
      <div className="bg-cyber-darker border-2 border-neon-blue/30 rounded-lg w-full max-w-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-3 md:p-4 border-b border-neon-blue/30 flex justify-between items-center sticky top-0 bg-cyber-darker z-10">
          <div className="flex items-center gap-2 md:gap-3">
            <RiFileTextLine className="w-5 h-5 md:w-6 md:h-6 text-neon-blue" />
            <h3 className="text-neon-blue text-base md:text-lg font-semibold">Import Guide</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-neon-blue/10 text-neon-blue transition-all duration-300 hover:scale-110"
          >
            <FiX className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Format Section */}
          <div className="space-y-2 md:space-y-3">
            <h4 className="text-white font-medium flex items-center gap-2 text-sm md:text-base">
              <RiInformationLine className="text-neon-purple w-4 h-4 md:w-5 md:h-5" />
              Required Format
            </h4>
            <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-neon-pink/20 overflow-x-auto">
              <code className="text-neon-pink font-mono text-xs md:text-sm whitespace-nowrap">timestamp,ad_id,bid_price,ctr,win_status</code>
            </div>
          </div>

          {/* Example Section */}
          <div className="space-y-2 md:space-y-3">
            <h4 className="text-white font-medium text-sm md:text-base">Example Data</h4>
            <div className="bg-black/30 p-3 md:p-4 rounded-lg border border-neon-green/20 overflow-x-auto">
              <pre className="text-neon-green font-mono text-xs md:text-sm">
                20130607000103501,88ea095ae6d01c3391bbba18a9601b36,300,6.000041961669922,5{'\n'}
                20130607000103502,7c7dec8c686f0f5451cec6c5be0b1600,230,2.123456789012345,0{'\n'}
                20130607000103503,4a76b067c38ad2b0b34845e2878e11cd,450,4.567890123456789,1
              </pre>
            </div>
          </div>

          {/* Column Details */}
          <div className="space-y-2 md:space-y-3">
            <h4 className="text-white font-medium text-sm md:text-base">Column Details</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-neon-purple text-xs md:text-sm">timestamp:</span>
                  <span className="text-gray-300 text-xs md:text-sm">YYYYMMDDHHmmssMMM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neon-purple text-xs md:text-sm">ad_id:</span>
                  <span className="text-gray-300 text-xs md:text-sm">Campaign identifier</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neon-purple text-xs md:text-sm">bid_price:</span>
                  <span className="text-gray-300 text-xs md:text-sm">Bid amount in cents</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-neon-purple text-xs md:text-sm">ctr:</span>
                  <span className="text-gray-300 text-xs md:text-sm">Click-through rate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neon-purple text-xs md:text-sm">win_status:</span>
                  <span className="text-gray-300 text-xs md:text-sm">&gt; 0 for win, &le; 0 for loss</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="space-y-2 md:space-y-3">
            <h4 className="text-white font-medium text-sm md:text-base">Important Notes</h4>
            <ul className="list-none space-y-1.5 md:space-y-2">
              {[
                'No header row required',
                'Fields must be comma-separated',
                'All fields are required',
                'Timestamp must be exactly 17 digits',
                'Win status: Any value > 0 is a win, ≤ 0 is a loss'
              ].map((note, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-300 text-xs md:text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-neon-purple flex-shrink-0" />
                  {note}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 md:p-4 border-t border-neon-blue/30 flex justify-end sticky bottom-0 bg-cyber-darker">
          <button
            onClick={onClose}
            className="px-4 md:px-6 py-1.5 md:py-2 bg-neon-blue/10 hover:bg-neon-blue/20 text-neon-blue rounded-lg transition-colors text-sm md:text-base"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportGuide; 