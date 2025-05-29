import { useState } from 'react';
import { QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

interface NFactor {
  value: number;
  onChange: (value: number) => void;
}

function NFactor({ value, onChange }: NFactor) {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseFloat(event.target.value));
  };

  return (
    <div className="bg-dark-bg-secondary p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <h3 className="text-sm font-medium text-dark-text-primary mr-2">N-Factor</h3>
          <button
            type="button"
            className="text-dark-text-secondary hover:text-dark-text-primary"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <QuestionMarkCircleIcon className="h-4 w-4" />
          </button>
        </div>
        <span className="text-sm font-medium text-dark-text-primary">{value.toFixed(2)}</span>
      </div>

      {showTooltip && (
        <div className="bg-dark-bg-tertiary text-dark-text-secondary text-xs p-2 rounded-md mb-2">
          The N-Factor controls bid aggressiveness. Higher values (&gt;1.0) increase bid amounts, while lower values (&lt;1.0) decrease them.
        </div>
      )}

      <input
        type="range"
        min="0.1"
        max="2.0"
        step="0.1"
        value={value}
        onChange={handleSliderChange}
        className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer accent-primary-500"
      />

      <div className="flex justify-between mt-1 text-xs text-dark-text-secondary">
        <span>Conservative (0.1x)</span>
        <span>Aggressive (2.0x)</span>
      </div>
    </div>
  );
}

export default NFactor; 