import { useState, useEffect } from 'react';

interface NFactor {
  value: number;
  onChange: (value: number) => void;
}

const NFactor = ({ value, onChange }: NFactor) => {
  const [localValue, setLocalValue] = useState(value);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    setLocalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-dark-text-secondary mb-1">
        N-Factor
        <button
          type="button"
          className="ml-2 text-dark-text-secondary hover:text-dark-text-primary focus:outline-none"
          onMouseEnter={() => setIsTooltipVisible(true)}
          onMouseLeave={() => setIsTooltipVisible(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </label>
      
      {isTooltipVisible && (
        <div className="absolute z-10 w-64 px-4 py-3 text-sm text-dark-text-primary bg-dark-bg-tertiary border border-dark-border rounded-lg shadow-lg -right-2 top-10">
          <p>Adjust bid aggressiveness. Higher values increase chances of winning but may increase costs.</p>
          <div className="absolute -top-2 right-4 w-4 h-4 bg-dark-bg-tertiary border-t border-l border-dark-border transform rotate-45"></div>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <input
          type="range"
          min="0.1"
          max="2.0"
          step="0.1"
          value={localValue}
          onChange={handleChange}
          className="w-full h-2 bg-dark-bg-tertiary rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-dark-text-primary font-medium w-12 text-right">
          {localValue.toFixed(1)}x
        </span>
      </div>
    </div>
  );
};

export default NFactor; 