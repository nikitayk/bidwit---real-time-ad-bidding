import React, { useState } from 'react';
import { RiSparklingFill, RiHeartsFill, RiCloseLine } from 'react-icons/ri';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface GuideStep {
  title: string;
  description: string;
  icon: JSX.Element;
}

const HelpGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: GuideStep[] = [
    {
      title: "Welcome to BIDWIT! 💖",
      description: "Your elegant real-time bidding analytics dashboard. Let's explore the features together!",
      icon: <RiHeartsFill className="w-8 h-8 text-neon-pink" />
    },
    {
      title: "Real-Time Metrics ✨",
      description: "Monitor your key performance indicators in real-time. Total bids, win rates, budget tracking, and more - all beautifully visualized.",
      icon: <RiSparklingFill className="w-8 h-8 text-neon-purple" />
    },
    {
      title: "Interactive Charts 📊",
      description: "Track bid performance and campaign metrics with our interactive charts. Hover over data points for detailed insights.",
      icon: <RiSparklingFill className="w-8 h-8 text-soft-pink" />
    },
    {
      title: "Campaign Management 🎯",
      description: "Filter data by campaign, date range, and use the N-Factor slider to adjust bid values in real-time.",
      icon: <RiSparklingFill className="w-8 h-8 text-soft-purple" />
    },
    {
      title: "Live Bid Console 💫",
      description: "Watch your bids happen in real-time with our elegant console. Green indicates won bids, pink shows lost opportunities.",
      icon: <RiHeartsFill className="w-8 h-8 text-neon-pink" />
    },
    {
      title: "Data Import 📥",
      description: "Import your bid data using CSV/TXT files. Format: timestamp,ad_id,bid_price,ctr,win_status (header optional). Example: 2023-03-15T10:30:00,AD123,2.50,0.15,1",
      icon: <RiSparklingFill className="w-8 h-8 text-neon-purple" />
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
      <div className="bg-cyber-dark rounded-lg max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-soft-pink hover:text-neon-pink transition-colors p-2 z-10"
        >
          <RiCloseLine className="w-6 h-6" />
        </button>

        {/* Progress bar */}
        <div className="h-1 bg-cyber-darker">
          <div
            className="h-full bg-gradient-sparkle transition-all duration-300"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-cyber-darker border border-neon-pink/30 animate-float">
              {steps[currentStep].icon}
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-sparkle bg-clip-text text-transparent">
            {steps[currentStep].title}
          </h3>
          
          <p className="text-soft-purple text-center mb-8 text-lg">
            {steps[currentStep].description}
          </p>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-soft-pink hover:text-neon-pink hover:animate-glow'
              }`}
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex gap-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === currentStep
                      ? 'bg-gradient-sparkle w-6'
                      : 'bg-cyber-darker border border-neon-pink/30'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextStep}
              disabled={currentStep === steps.length - 1}
              className={`p-2 rounded-lg transition-all duration-200 ${
                currentStep === steps.length - 1
                  ? 'text-gray-500 cursor-not-allowed'
                  : 'text-soft-pink hover:text-neon-pink hover:animate-glow'
              }`}
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpGuide; 