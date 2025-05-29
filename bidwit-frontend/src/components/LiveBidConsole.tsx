import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BidOutcome {
  timestamp: string;
  bidId: string;
  advertiser: string;
  bidPrice: number;
  executionTime: number;
  outcome: 'won' | 'lost' | 'no-bid';
}

interface LiveBidConsoleProps {
  bids: BidOutcome[];
  maxItems?: number;
}

const LiveBidConsole = ({ bids, maxItems = 10 }: LiveBidConsoleProps) => {
  const consoleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [bids]);

  const getOutcomeColor = (outcome: BidOutcome['outcome']) => {
    switch (outcome) {
      case 'won':
        return 'text-green-500';
      case 'lost':
        return 'text-red-500';
      case 'no-bid':
        return 'text-yellow-500';
      default:
        return 'text-dark-text-primary';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-dark-bg-secondary rounded-lg shadow-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-dark-text-primary">Live Bid Console</h3>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
          </span>
          <span className="text-sm text-dark-text-secondary">Live</span>
        </div>
      </div>

      <div
        ref={consoleRef}
        className="h-[400px] overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-dark-border scrollbar-track-dark-bg-tertiary"
      >
        <AnimatePresence initial={false}>
          {bids.slice(-maxItems).map((bid, index) => (
            <motion.div
              key={bid.bidId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-dark-bg-tertiary rounded-lg p-3 text-sm"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-dark-text-secondary">{formatTimestamp(bid.timestamp)}</span>
                  <span className="font-mono text-dark-text-primary">{bid.bidId.substring(0, 8)}...</span>
                </div>
                <span className={`font-medium ${getOutcomeColor(bid.outcome)}`}>
                  {bid.outcome.toUpperCase()}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-4">
                <div>
                  <span className="text-dark-text-secondary">Advertiser</span>
                  <div className="font-medium text-dark-text-primary">{bid.advertiser}</div>
                </div>
                <div>
                  <span className="text-dark-text-secondary">Bid Price</span>
                  <div className="font-medium text-dark-text-primary">${bid.bidPrice.toFixed(2)}</div>
                </div>
                <div>
                  <span className="text-dark-text-secondary">Execution Time</span>
                  <div className="font-medium text-dark-text-primary">{bid.executionTime.toFixed(2)}ms</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiveBidConsole; 