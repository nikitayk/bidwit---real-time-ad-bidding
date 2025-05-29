import { useState, useEffect } from 'react';
import BidMetrics from './BidMetrics';
import LiveBidConsole from './LiveBidConsole';
import PerformanceChart from './PerformanceChart';
import { motion } from 'framer-motion';

interface BidOutcome {
  timestamp: string;
  bidId: string;
  advertiser: string;
  bidPrice: number;
  executionTime: number;
  outcome: 'won' | 'lost' | 'no-bid';
}

interface DashboardMetricsProps {
  campaignId: string;
  startDate: Date;
  endDate: Date;
}

const DashboardMetrics = ({ campaignId, startDate, endDate }: DashboardMetricsProps) => {
  // State for all metrics
  const [metrics, setMetrics] = useState({
    totalBidRequests: 0,
    successfulBids: 0,
    noBids: 0,
    avgBidPrice: 0,
    avgExecutionTime: 0,
    totalBidAmount: 0,
    budgetUsage: {
      total: 100000, // Example budget
      spent: 0,
    },
    ctr: 0,
    cvr: 0,
  });

  // State for live bid outcomes
  const [recentBids, setRecentBids] = useState<BidOutcome[]>([]);
  
  // State for performance data
  const [performanceData, setPerformanceData] = useState<Array<{
    timestamp: string;
    ctr: number;
    cvr: number;
  }>>([]);

  // Time range state for performance chart
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

  // Simulated data updates (replace with real API calls)
  useEffect(() => {
    // Simulate initial data load
    const loadInitialData = () => {
      // Example initial metrics
      setMetrics({
        totalBidRequests: 15000,
        successfulBids: 9000,
        noBids: 1500,
        avgBidPrice: 2.45,
        avgExecutionTime: 120,
        totalBidAmount: 22050,
        budgetUsage: {
          total: 100000,
          spent: 22050,
        },
        ctr: 0.025, // 2.5%
        cvr: 0.015, // 1.5%
      });

      // Generate some historical performance data
      const now = new Date();
      const historicalData = Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(now.getTime() - (23 - i) * 3600000).toISOString(),
        ctr: 0.02 + Math.random() * 0.01,
        cvr: 0.01 + Math.random() * 0.01,
      }));
      setPerformanceData(historicalData);
    };

    loadInitialData();

    // Simulate live updates
    const updateInterval = setInterval(() => {
      // Generate new bid
      const newBid: BidOutcome = {
        timestamp: new Date().toISOString(),
        bidId: Math.random().toString(36).substr(2, 9),
        advertiser: `Advertiser_${Math.floor(Math.random() * 10)}`,
        bidPrice: Math.random() * 5 + 1,
        executionTime: Math.random() * 200 + 50,
        outcome: Math.random() > 0.3 ? 'won' : Math.random() > 0.5 ? 'lost' : 'no-bid',
      };

      // Update recent bids
      setRecentBids(prev => [...prev.slice(-19), newBid]);

      // Update metrics
      setMetrics(prev => {
        const newMetrics = { ...prev };
        newMetrics.totalBidRequests += 1;
        if (newBid.outcome === 'won') {
          newMetrics.successfulBids += 1;
          newMetrics.totalBidAmount += newBid.bidPrice;
          newMetrics.budgetUsage.spent += newBid.bidPrice;
        } else if (newBid.outcome === 'no-bid') {
          newMetrics.noBids += 1;
        }
        newMetrics.avgBidPrice = newMetrics.totalBidAmount / newMetrics.successfulBids;
        newMetrics.avgExecutionTime = (prev.avgExecutionTime + newBid.executionTime) / 2;
        return newMetrics;
      });

      // Update performance data
      setPerformanceData(prev => {
        const newData = [...prev.slice(1)];
        newData.push({
          timestamp: new Date().toISOString(),
          ctr: prev[prev.length - 1].ctr * (1 + (Math.random() - 0.5) * 0.1),
          cvr: prev[prev.length - 1].cvr * (1 + (Math.random() - 0.5) * 0.1),
        });
        return newData;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(updateInterval);
  }, [campaignId]);

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <BidMetrics {...metrics} />

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <PerformanceChart
            data={performanceData}
            timeRange={timeRange}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <LiveBidConsole
            bids={recentBids}
            maxItems={10}
          />
        </motion.div>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {(['1h', '24h', '7d', '30d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === range
                ? 'bg-primary-500 text-white'
                : 'bg-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text-primary'
            }`}
          >
            {range === '1h' ? 'Last Hour' :
             range === '24h' ? 'Last 24H' :
             range === '7d' ? 'Last 7D' :
             'Last 30D'}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DashboardMetrics; 