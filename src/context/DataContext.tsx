import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

// Constants for demo data
const UPDATE_INTERVAL = 1000; // 1 second between updates
const MAX_DATA_POINTS = 50; // Keep last 50 data points for visualization
const DEMO_CAMPAIGNS = {
  'Display Ads': { 
    basePrice: 300, 
    variance: 50, 
    avgExecTime: 25,
    basePerformance: 0.85 // 85% performance baseline
  },
  'Search Ads': { 
    basePrice: 230, 
    variance: 30, 
    avgExecTime: 15,
    basePerformance: 0.92 // 92% performance baseline
  },
  'Social Media': { 
    basePrice: 450, 
    variance: 40, 
    avgExecTime: 20,
    basePerformance: 0.88 // 88% performance baseline
  }
};

// Initial metrics state
const INITIAL_METRICS = {
  totalBids: 0,
  winRate: 0,
  averageCTR: 0,
  averageBidPrice: 0,
  activeCampaigns: Object.keys(DEMO_CAMPAIGNS).length,
  totalBudget: 100000,
  remainingBudget: 100000,
  averageExecutionTime: 0,
  successfulBids: 0,
  failedBids: 0,
  totalBidAmount: 0
};

interface BidData {
  timestamp: number;
  adId: string;
  bidPrice: number;
  ctr: number;
  isWon: boolean;
  campaign: string;
  executionTime: number;
  performance: number;
}

interface MetricsData {
  totalBids: number;
  winRate: number;
  averageCTR: number;
  averageBidPrice: number;
  activeCampaigns: number;
  totalBudget: number;
  remainingBudget: number;
  averageExecutionTime: number;
  successfulBids: number;
  failedBids: number;
  totalBidAmount: number;
  averagePerformance?: number;
}

interface CampaignKPI {
  name: string;
  totalBids: number;
  winRate: number;
  averageCTR: number;
  totalSpent: number;
  averageBidPrice: number;
  averageExecutionTime: number;
  bidVolume: number;
  successRate: number;
  recentBids: Array<{
    timestamp: number;
    bidPrice: number;
    executionTime: number;
    isWon: boolean;
  }>;
}

// Add TimeSeriesPoint interface for better type safety
interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

interface TimeBasedMetrics {
  timestamp: number;
  averageExecutionTime: number;
  bidCount: number;
  successRate: number;
  averageBidPrice: number;
  averageCTR: number;
  bidsData: Array<{
    timestamp: number;
    bidPrice: number;
    ctr: number;
    isWon: boolean;
  }>;
}

// Add performance series interface
interface PerformancePoint {
  timestamp: number;
  executionTime: number;
  performance: number;
  successRate: number;
}

interface DataContextType {
  bidData: BidData[];
  metrics: MetricsData;
  campaigns: string[];
  campaignKPIs: CampaignKPI[];
  timeBasedMetrics: TimeBasedMetrics[];
  bidPriceSeries: TimeSeriesPoint[]; // Added for bid price chart
  ctrSeries: TimeSeriesPoint[]; // Added for CTR chart
  performanceSeries: PerformancePoint[]; // Added for performance charts
  importData: (data: string | File | BidData[]) => Promise<void>;
  selectedCampaign: string;
  setSelectedCampaign: (campaign: string) => void;
  dateRange: [Date, Date];
  setDateRange: (range: [Date, Date]) => void;
  nFactor: number;
  setNFactor: (value: number) => void;
  isPaused: boolean;
  setIsPaused: (value: boolean | ((prev: boolean) => boolean)) => void;
  isImporting: boolean;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State
  const [bidData, setBidData] = useState<BidData[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>(INITIAL_METRICS);
  const [campaigns] = useState<string[]>(Object.keys(DEMO_CAMPAIGNS));
  const [campaignKPIs, setCampaignKPIs] = useState<CampaignKPI[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [nFactor, setNFactor] = useState<number>(1);
  const [isPaused, setIsPaused] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [timeBasedMetrics, setTimeBasedMetrics] = useState<TimeBasedMetrics[]>([]);
  const [bidPriceSeries, setBidPriceSeries] = useState<TimeSeriesPoint[]>([]);
  const [ctrSeries, setCtrSeries] = useState<TimeSeriesPoint[]>([]);
  const [performanceSeries, setPerformanceSeries] = useState<PerformancePoint[]>([]);

  // Add new refs for imported data handling
  const importedDataBuffer = useRef<BidData[]>([]);
  const currentDataIndex = useRef<number>(0);
  const isUsingMockData = useRef<boolean>(true);
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper functions
  const generateMockBid = useCallback((): BidData => {
    const campaigns = Object.keys(DEMO_CAMPAIGNS);
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)] as keyof typeof DEMO_CAMPAIGNS;
    const { basePrice, variance, avgExecTime, basePerformance } = DEMO_CAMPAIGNS[campaign];
    
    // Calculate performance metrics
    const timeVariance = 10;
    const execTime = avgExecTime + (Math.random() * 2 - 1) * timeVariance;
    const performanceVariance = 0.1; // 10% variance in performance
    const performance = Math.min(1, Math.max(0.5, basePerformance + (Math.random() * 2 - 1) * performanceVariance));
    const winProbability = performance * 0.8; // Performance affects win probability
    const isWon = Math.random() < winProbability;
    
    // CTR is affected by performance
    const baseCTR = 5; // 5% base CTR
    const ctrVariance = 2; // ±2% variance
    const ctr = baseCTR * performance + (Math.random() * 2 - 1) * ctrVariance;
    
    return {
      timestamp: Date.now(),
      adId: Math.random().toString(36).substring(2, 15),
      bidPrice: basePrice + (Math.random() * 2 - 1) * variance,
      ctr,
      isWon,
      campaign,
      executionTime: execTime,
      performance
    };
  }, []);

  const calculateMetrics = useCallback((data: BidData[]) => {
    if (data.length === 0) return INITIAL_METRICS;

    const totalBids = data.length;
    const wonBids = data.filter(bid => bid.isWon).length;
    const totalBidAmount = data.reduce((sum, bid) => sum + bid.bidPrice, 0);
    const totalCTR = data.reduce((sum, bid) => sum + bid.ctr, 0);
    const spentAmount = data.reduce((sum, bid) => sum + (bid.isWon ? bid.bidPrice : 0), 0);
    const totalExecTime = data.reduce((sum, bid) => sum + bid.executionTime, 0);
    const totalPerformance = data.reduce((sum, bid) => sum + (bid.performance || 0), 0);

    return {
      totalBids,
      winRate: (wonBids / totalBids) * 100,
      averageCTR: totalCTR / totalBids,
      averageBidPrice: totalBidAmount / totalBids,
      activeCampaigns: Object.keys(DEMO_CAMPAIGNS).length,
      totalBudget: INITIAL_METRICS.totalBudget,
      remainingBudget: INITIAL_METRICS.totalBudget - spentAmount,
      averageExecutionTime: totalExecTime / totalBids,
      successfulBids: wonBids,
      failedBids: totalBids - wonBids,
      totalBidAmount,
      averagePerformance: totalPerformance / totalBids
    };
  }, []);

  const calculateCampaignKPIs = useCallback((data: BidData[]) => {
    const campaignData: { [key: string]: BidData[] } = {};
    
    data.forEach(bid => {
      const campaign = bid.campaign || 'Unknown';
      if (!campaignData[campaign]) {
        campaignData[campaign] = [];
      }
      campaignData[campaign].push(bid);
    });

    return Object.entries(campaignData).map(([name, bids]) => {
      const totalBids = bids.length;
      const wonBids = bids.filter(bid => bid.isWon).length;
      const totalSpent = bids.reduce((sum, bid) => sum + (bid.isWon ? bid.bidPrice : 0), 0);
      const totalBidPrice = bids.reduce((sum, bid) => sum + bid.bidPrice, 0);
      const totalCTR = bids.reduce((sum, bid) => sum + bid.ctr, 0);
      const totalExecTime = bids.reduce((sum, bid) => sum + bid.executionTime, 0);

      const sortedBids = [...bids].sort((a, b) => b.timestamp - a.timestamp);
      const last10Bids = sortedBids.slice(0, 10);

      const successRate = (wonBids / totalBids) * 100;

      const recentBids = last10Bids.map(bid => ({
        timestamp: bid.timestamp,
        bidPrice: bid.bidPrice,
        executionTime: bid.executionTime,
        isWon: bid.isWon
      }));

      return {
        name,
        totalBids,
        winRate: (wonBids / totalBids) * 100,
        averageCTR: totalCTR / totalBids,
        totalSpent,
        averageBidPrice: totalBidPrice / totalBids,
        averageExecutionTime: totalExecTime / totalBids,
        bidVolume: totalBids,
        successRate,
        recentBids
      };
    });
  }, []);

  // Enhanced time series update with performance tracking
  const updateTimeSeries = useCallback((newBids: BidData[]) => {
    console.log('Updating time series with bids:', newBids.length);
    const now = Date.now();
    const timeWindow = 5 * 60 * 1000; // 5 minutes window
    const cutoffTime = now - timeWindow;

    // Helper function to update series with proper trimming
    const updateSeries = <T extends { timestamp: number }>(
      setter: React.Dispatch<React.SetStateAction<T[]>>,
      current: T[],
      newPoints: T[]
    ) => {
      const filtered = current.filter(point => point.timestamp > cutoffTime);
      const combined = [...filtered, ...newPoints].sort((a, b) => a.timestamp - b.timestamp);
      // Keep only the most recent MAX_DATA_POINTS
      return combined.slice(-MAX_DATA_POINTS);
    };

    // Update bid price series
    setBidPriceSeries(current => {
      const newPoints = newBids.map(bid => ({
        timestamp: bid.timestamp,
        value: bid.bidPrice
      }));
      return updateSeries(setBidPriceSeries, current, newPoints);
    });

    // Update CTR series
    setCtrSeries(current => {
      const newPoints = newBids.map(bid => ({
        timestamp: bid.timestamp,
        value: bid.ctr
      }));
      return updateSeries(setCtrSeries, current, newPoints);
    });

    // Update performance series
    setPerformanceSeries(current => {
      console.log('Updating performance series');
      const newPoints = newBids.map(bid => ({
        timestamp: bid.timestamp,
        executionTime: bid.executionTime,
        performance: bid.performance,
        successRate: bid.isWon ? 1 : 0
      }));
      const updated = updateSeries(setPerformanceSeries, current, newPoints);
      console.log('Performance series size:', updated.length);
      return updated;
    });
  }, []);

  // Enhanced time-based metrics calculation
  const calculateTimeBasedMetrics = useCallback((data: BidData[]) => {
    const sortedData = [...data].sort((a, b) => a.timestamp - b.timestamp);
    
    const minuteGroups: { [key: string]: BidData[] } = {};
    sortedData.forEach(bid => {
      const minute = new Date(bid.timestamp).setSeconds(0, 0);
      if (!minuteGroups[minute]) {
        minuteGroups[minute] = [];
      }
      minuteGroups[minute].push(bid);
    });

    return Object.entries(minuteGroups).map(([timestamp, bids]) => ({
      timestamp: parseInt(timestamp),
      averageExecutionTime: bids.reduce((sum, bid) => sum + bid.executionTime, 0) / bids.length,
      bidCount: bids.length,
      successRate: (bids.filter(bid => bid.isWon).length / bids.length) * 100,
      averageBidPrice: bids.reduce((sum, bid) => sum + bid.bidPrice, 0) / bids.length,
      averageCTR: bids.reduce((sum, bid) => sum + bid.ctr, 0) / bids.length,
      bidsData: bids.map(bid => ({
        timestamp: bid.timestamp,
        bidPrice: bid.bidPrice,
        ctr: bid.ctr,
        isWon: bid.isWon
      }))
    }));
  }, []);

  // Generate initial historical data
  const generateInitialHistory = useCallback(() => {
    const now = Date.now();
    const historyWindow = 5 * 60 * 1000; // 5 minutes of history
    const pointCount = 30; // 30 initial points
    const timeStep = historyWindow / pointCount;

    const historicalBids = Array(pointCount).fill(null).map((_, index) => {
      const historicalBid = generateMockBid();
      // Override timestamp to create historical sequence
      historicalBid.timestamp = now - (pointCount - index) * timeStep;
      return historicalBid;
    });

    return historicalBids;
  }, [generateMockBid]);

  // Initialize with historical data
  useEffect(() => {
    if (isUsingMockData.current && bidData.length === 0) {
      const initialHistory = generateInitialHistory();
      setBidData(initialHistory);
      updateTimeSeries(initialHistory);
    }
  }, [generateInitialHistory, updateTimeSeries]);

  // Mock data generation with batch updates and immediate time series update
  const startMockDataGeneration = useCallback(() => {
    if (!isUsingMockData.current || isPaused) return;

    // If no data exists, generate initial history
    if (bidData.length === 0) {
      const initialHistory = generateInitialHistory();
      setBidData(initialHistory);
      updateTimeSeries(initialHistory);
    }

    const BATCH_SIZE = 3; // Generate 3 bids per update

    updateIntervalRef.current = setInterval(() => {
      const newBids = Array(BATCH_SIZE).fill(null).map(() => generateMockBid());
      
      setBidData(current => {
        const updated = [...current, ...newBids].slice(-MAX_DATA_POINTS);
        return updated;
      });

      // Immediately update time series with new bids
      updateTimeSeries(newBids);
    }, UPDATE_INTERVAL);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [generateMockBid, isPaused, updateTimeSeries, bidData.length, generateInitialHistory]);

  // Add new function for simulating real-time updates with imported data
  const simulateImportedDataUpdates = useCallback(() => {
    if (!importedDataBuffer.current.length) {
      console.log('No data in buffer');
      return;
    }

    const BATCH_SIZE = 3; // Same as mock data generation
    const newBids: BidData[] = [];
    const now = Date.now();
    const firstTimestamp = importedDataBuffer.current[0].timestamp;
    const lastIndex = importedDataBuffer.current.length - 1;

    console.log('Simulating updates, current index:', currentDataIndex.current, 'of', lastIndex);

    for (let i = 0; i < BATCH_SIZE; i++) {
      if (currentDataIndex.current >= importedDataBuffer.current.length) {
        console.log('Resetting index to beginning');
        currentDataIndex.current = 0;
      }

      const originalBid = importedDataBuffer.current[currentDataIndex.current];
      const timeOffset = originalBid.timestamp - firstTimestamp;
      
      // Create a new bid with updated timestamp
      const newBid: BidData = {
        ...originalBid,
        timestamp: now - (lastIndex - currentDataIndex.current) * UPDATE_INTERVAL,
        // Regenerate execution time and maintain performance
        executionTime: originalBid.isWon ? 15 + Math.random() * 5 : 25 + Math.random() * 10
      };

      newBids.push(newBid);
      currentDataIndex.current++;
    }

    if (newBids.length > 0) {
      console.log('Updating with new bids:', newBids.length);
      setBidData(current => {
        const updated = [...current, ...newBids].slice(-MAX_DATA_POINTS);
        return updated;
      });
      updateTimeSeries(newBids);
    }
  }, [updateTimeSeries]);

  // Modify the effect that handles data generation
  useEffect(() => {
    console.log('Effect triggered - isPaused:', isPaused, 'isUsingMockData:', isUsingMockData.current);
    
    if (isPaused) {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
      return;
    }

    // Clear any existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    // Start the appropriate data generation
    if (isUsingMockData.current) {
      console.log('Starting mock data generation');
      startMockDataGeneration();
    } else {
      console.log('Starting imported data simulation');
      // Initial update
      simulateImportedDataUpdates();
      // Set up interval for continuous updates
      updateIntervalRef.current = setInterval(simulateImportedDataUpdates, UPDATE_INTERVAL);
    }

    // Cleanup function
    return () => {
      console.log('Cleaning up interval');
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }
    };
  }, [isPaused, startMockDataGeneration, simulateImportedDataUpdates, isUsingMockData]);

  // Update metrics and KPIs when bid data changes
  useEffect(() => {
    const newMetrics = calculateMetrics(bidData);
    const newKPIs = calculateCampaignKPIs(bidData);
    const newTimeMetrics = calculateTimeBasedMetrics(bidData);
    
    setMetrics(newMetrics);
    setCampaignKPIs(newKPIs);
    setTimeBasedMetrics(newTimeMetrics);
  }, [bidData, calculateMetrics, calculateCampaignKPIs, calculateTimeBasedMetrics]);

  // Modify the importData function
  const importData = useCallback(async (data: string | File | BidData[]) => {
    try {
      console.log('Starting import process');
      setIsImporting(true);
      setIsPaused(true);
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }

      let parsedData: BidData[];

      if (Array.isArray(data)) {
        parsedData = data;
      } else {
        let fileContent: string;
        if (data instanceof File) {
          fileContent = await data.text();
        } else if (typeof data === 'string') {
          fileContent = data;
        } else {
          throw new Error('Invalid input format');
        }

        const lines = fileContent.trim().split('\n');
        console.log('Processing', lines.length, 'lines of data');
        
        parsedData = lines
          .map((line, index) => {
            try {
              if (!line.trim()) return null;

              const [timestamp, adId, bidPrice, ctr, winStatus] = line.trim().split(',');
              if (!timestamp || !adId || !bidPrice || !ctr || !winStatus) return null;

              const ts = timestamp.trim();
              if (ts.length !== 17) return null;

              const parsedTimestamp = new Date(
                `${ts.slice(0,4)}-${ts.slice(4,6)}-${ts.slice(6,8)}T${ts.slice(8,10)}:${ts.slice(10,12)}:${ts.slice(12,14)}.${ts.slice(14)}`
              ).getTime();

              if (isNaN(parsedTimestamp)) return null;

              const parsedBidPrice = parseFloat(bidPrice.trim());
              const parsedCTR = parseFloat(ctr.trim());
              const winStatusValue = parseFloat(winStatus.trim());
              const isWon = winStatusValue > 0; // Any value above 0 is a win
              
              if (isNaN(parsedBidPrice) || isNaN(parsedCTR) || isNaN(winStatusValue)) return null;

              // Calculate performance based on win status and CTR
              const winPerformance = isWon ? Math.min(1.0, winStatusValue / 5.0) : 0.0;
              const ctrPerformance = Math.min(1.0, parsedCTR / 5.0);
              const performance = (winPerformance * 0.7) + (ctrPerformance * 0.3);

              const bid: BidData = {
                timestamp: parsedTimestamp,
                adId: adId.trim(),
                bidPrice: parsedBidPrice,
                ctr: parsedCTR,
                isWon,
                campaign: 'Imported Campaign',
                executionTime: isWon ? 15 + Math.random() * 5 : 25 + Math.random() * 10,
                performance
              };
              return bid;
            } catch (err) {
              console.error('Error parsing line', index + 1);
              return null;
            }
          })
          .filter((bid): bid is BidData => bid !== null);
      }

      if (parsedData.length === 0) {
        throw new Error('No valid data found');
      }

      console.log('Successfully parsed', parsedData.length, 'bids');

      // Sort data by timestamp
      parsedData.sort((a, b) => a.timestamp - b.timestamp);
      
      importedDataBuffer.current = parsedData;
      currentDataIndex.current = 0;
      isUsingMockData.current = false;

      const initialBatch = parsedData.slice(0, MAX_DATA_POINTS);
      console.log('Setting initial batch of', initialBatch.length, 'bids');
      
      setBidData(initialBatch);
      updateTimeSeries(initialBatch);
      
      // Important: Set isPaused to false after a short delay to ensure state is updated
      setTimeout(() => {
        console.log('Starting continuous updates');
        setIsPaused(false);
      }, 100);
      
    } catch (error) {
      console.error('Import error:', error);
      throw error;
    } finally {
      setIsImporting(false);
    }
  }, [updateTimeSeries]);

  // Context value with new series data
  const value = {
    bidData,
    metrics,
    campaigns,
    campaignKPIs,
    timeBasedMetrics,
    bidPriceSeries,
    ctrSeries,
    performanceSeries,
    importData,
    selectedCampaign,
    setSelectedCampaign,
    dateRange,
    setDateRange,
    nFactor,
    setNFactor,
    isPaused,
    setIsPaused,
    isImporting
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};