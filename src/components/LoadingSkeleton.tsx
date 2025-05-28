import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-dark text-white p-2 md:p-6 pt-4 md:pt-12 animate-pulse">
      <div className="max-w-[1920px] mx-auto">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-cyber-darker border border-neon-blue/30 rounded-lg p-4">
              <div className="h-4 bg-neon-blue/20 rounded w-1/3 mb-2"></div>
              <div className="h-6 bg-neon-blue/20 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-neon-blue/20 rounded w-2/3"></div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="h-10 bg-cyber-darker border border-neon-blue/30 rounded-lg w-48"></div>
          <div className="h-10 bg-cyber-darker border border-neon-blue/30 rounded-lg w-32"></div>
          <div className="h-10 bg-cyber-darker border border-neon-blue/30 rounded-lg w-40"></div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            {/* Performance Chart */}
            <div className="bg-cyber-darker border border-neon-pink/30 rounded-lg p-4">
              <div className="h-4 bg-neon-pink/20 rounded w-1/4 mb-4"></div>
              <div className="h-[300px] md:h-[400px] bg-neon-pink/10 rounded"></div>
            </div>
            
            {/* Campaign Chart */}
            <div className="bg-cyber-darker border border-neon-purple/30 rounded-lg p-4">
              <div className="h-4 bg-neon-purple/20 rounded w-1/4 mb-4"></div>
              <div className="h-[250px] md:h-[300px] bg-neon-purple/10 rounded"></div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            {/* Bid Console */}
            <div className="bg-cyber-darker border border-neon-pink/30 rounded-lg p-4">
              <div className="h-4 bg-neon-pink/20 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-neon-pink/10 rounded"></div>
                ))}
              </div>
            </div>

            {/* KPIs */}
            <div className="bg-cyber-darker border border-neon-purple/30 rounded-lg p-4">
              <div className="h-4 bg-neon-purple/20 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-neon-purple/10 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton; 