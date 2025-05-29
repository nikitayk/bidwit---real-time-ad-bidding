import { motion } from 'framer-motion';

interface BidMetricsProps {
  totalBidRequests: number;
  successfulBids: number;
  noBids: number;
  avgBidPrice: number;
  avgExecutionTime: number;
  totalBidAmount: number;
  budgetUsage: {
    total: number;
    spent: number;
  };
  ctr: number;
  cvr: number;
}

const BidMetrics = ({
  totalBidRequests,
  successfulBids,
  noBids,
  avgBidPrice,
  avgExecutionTime,
  totalBidAmount,
  budgetUsage,
  ctr,
  cvr,
}: BidMetricsProps) => {
  const budgetPercentage = (budgetUsage.spent / budgetUsage.total) * 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Bid Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-bg-secondary p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-dark-text-secondary text-sm font-medium mb-4">Bid Statistics</h3>
        <div className="space-y-3">
          <div>
            <div className="text-dark-text-secondary text-sm">Total Requests</div>
            <div className="text-2xl font-semibold text-dark-text-primary">{totalBidRequests.toLocaleString()}</div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="text-dark-text-secondary text-sm">Successful</div>
              <div className="text-lg font-medium text-green-500">{successfulBids.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-dark-text-secondary text-sm">No Bids</div>
              <div className="text-lg font-medium text-red-500">{noBids.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Performance Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-dark-bg-secondary p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-dark-text-secondary text-sm font-medium mb-4">Performance</h3>
        <div className="space-y-3">
          <div>
            <div className="text-dark-text-secondary text-sm">Avg. Execution Time</div>
            <div className="text-2xl font-semibold text-dark-text-primary">{avgExecutionTime.toFixed(2)}ms</div>
          </div>
          <div className="flex justify-between">
            <div>
              <div className="text-dark-text-secondary text-sm">CTR</div>
              <div className="text-lg font-medium text-primary-500">{(ctr * 100).toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-dark-text-secondary text-sm">CVR</div>
              <div className="text-lg font-medium text-primary-500">{(cvr * 100).toFixed(2)}%</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bid Amounts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-dark-bg-secondary p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-dark-text-secondary text-sm font-medium mb-4">Bid Amounts</h3>
        <div className="space-y-3">
          <div>
            <div className="text-dark-text-secondary text-sm">Total Bid Amount</div>
            <div className="text-2xl font-semibold text-dark-text-primary">
              ${totalBidAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div>
            <div className="text-dark-text-secondary text-sm">Avg. Bid Price</div>
            <div className="text-lg font-medium text-dark-text-primary">
              ${avgBidPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Budget Usage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-dark-bg-secondary p-6 rounded-lg shadow-lg"
      >
        <h3 className="text-dark-text-secondary text-sm font-medium mb-4">Budget Usage</h3>
        <div className="space-y-3">
          <div>
            <div className="text-dark-text-secondary text-sm">Total Budget</div>
            <div className="text-2xl font-semibold text-dark-text-primary">
              ${budgetUsage.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-dark-text-secondary">Usage</span>
              <span className="text-dark-text-primary font-medium">{budgetPercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-dark-bg-tertiary rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-dark-text-secondary">
              <span>Spent: ${budgetUsage.spent.toLocaleString()}</span>
              <span>Remaining: ${(budgetUsage.total - budgetUsage.spent).toLocaleString()}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BidMetrics; 