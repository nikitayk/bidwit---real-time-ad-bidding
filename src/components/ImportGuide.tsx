import React from 'react';
import { FiInfo } from 'react-icons/fi';

const ImportGuide: React.FC = () => {
  return (
    <div className="bg-cyber-darker border border-neon-blue/30 rounded-lg p-6 mb-6">
      <div className="flex items-start space-x-3">
        <FiInfo className="w-6 h-6 text-neon-blue flex-shrink-0 mt-1" />
        <div>
          <h3 className="text-neon-blue text-lg font-semibold mb-3">File Import Guide</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Required Format</h4>
              <p className="text-gray-300 mb-2">Your file should be a CSV or TXT file with the following columns:</p>
              <div className="bg-black/30 p-3 rounded-md">
                <code className="text-neon-pink">timestamp,ad_id,bid_price,ctr,win_status</code>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Example Data</h4>
              <div className="bg-black/30 p-3 rounded-md overflow-x-auto">
                <pre className="text-neon-green text-sm">
                  20130607000103501,88ea095ae6d01c3391bbba18a9601b36,300,6.000041961669922,5
                  20130607000103502,7c7dec8c686f0f5451cec6c5be0b1600,230,2.123456789012345,0
                  20130607000103503,4a76b067c38ad2b0b34845e2878e11cd,450,4.567890123456789,1
                </pre>
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Column Descriptions</h4>
              <ul className="text-gray-300 space-y-2">
                <li><span className="text-neon-purple">timestamp:</span> Format YYYYMMDDHHMMSSMMM (17 digits)</li>
                <li><span className="text-neon-purple">ad_id:</span> Campaign identifier (string)</li>
                <li><span className="text-neon-purple">bid_price:</span> Bid amount in cents (number)</li>
                <li><span className="text-neon-purple">ctr:</span> Click-through rate (decimal)</li>
                <li><span className="text-neon-purple">win_status:</span> 1 or 5 for won, 0 for lost</li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Important Notes</h4>
              <ul className="text-gray-300 list-disc list-inside space-y-1">
                <li>Maximum file size: 10,000 rows (larger files will be trimmed)</li>
                <li>No header row required</li>
                <li>Fields must be comma-separated</li>
                <li>All fields are required</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportGuide; 