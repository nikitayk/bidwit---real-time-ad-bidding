import React from 'react';
import { FiHelpCircle } from 'react-icons/fi';

interface NFactorProps {
  value: number;
  onChange: (value: number) => void;
  onHelpClick: () => void;
}

const NFactor: React.FC<NFactorProps> = ({ value, onChange, onHelpClick }) => {
  return (
    <div className="flex items-center gap-4">
      <label className="flex items-center gap-2">
        <span className="text-neon-blue">N-Factor</span>
        <button
          onClick={onHelpClick}
          className="text-soft-blue hover:text-neon-blue transition-colors"
          aria-label="Learn more about N-Factor"
        >
          <FiHelpCircle className="w-5 h-5" />
        </button>
      </label>
      <input
        type="range"
        min="1"
        max="10"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-32 accent-neon-blue"
      />
      <span className="text-soft-blue min-w-[2ch] text-center">{value}</span>
    </div>
  );
};

export default NFactor; 