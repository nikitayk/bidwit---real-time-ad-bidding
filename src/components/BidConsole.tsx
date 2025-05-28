import React, { useEffect, useRef } from 'react';

interface BidConsoleProps {
  bids: Array<{
    timestamp: string;
    adId: string;
    bidPrice: number;
    ctr: number;
    winStatus: number;
  }>;
  isLive: boolean;
}

const BidConsole: React.FC<BidConsoleProps> = ({ bids, isLive }) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [bids]);

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const formatCurrency = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  return (
    <div className="cyber-card rounded-lg p-4 neon-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold tracking-wider text-neon-blue neon-text">
          BID CONSOLE
        </h2>
        {isLive && (
          <div className="flex items-center">
            <div className="w-2 h-2 bg-money-green rounded-full animate-pulse mr-2"></div>
            <span className="text-sm text-money-green neon-text-money">LIVE</span>
          </div>
        )}
      </div>
      
      <div
        ref={consoleRef}
        className="h-[400px] overflow-y-auto space-y-2 custom-scrollbar"
      >
        {bids.map((bid, index) => (
          <div
            key={`${bid.timestamp}-${index}`}
            className={`cyber-card p-3 rounded-lg ${
              index === bids.length - 1 ? 'animate-fadeIn' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-neon-blue font-mono">
                {formatTimestamp(bid.timestamp)}
              </span>
              <span className={`text-sm font-medium px-2 py-1 rounded ${
                bid.winStatus === 1
                  ? 'bg-money-green/20 text-money-green neon-text-money'
                  : 'bg-neon-pink/20 text-neon-pink'
              }`}>
                {bid.winStatus === 1 ? 'WON' : 'LOST'}
              </span>
            </div>
            
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">AD ID</p>
                <p className="font-mono text-neon-blue neon-text">
                  {bid.adId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">BID PRICE</p>
                <p className="font-mono text-money-green neon-text-money">
                  {formatCurrency(bid.bidPrice)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">CTR</p>
                <p className="font-mono text-neon-blue neon-text">
                  {(bid.ctr * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {bids.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 mb-2">
                NO BID DATA AVAILABLE
              </p>
              {isLive && (
                <p className="text-neon-blue neon-text animate-pulse">
                  WAITING FOR BIDS...
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BidConsole; 