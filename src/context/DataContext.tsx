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
  performance?: number;
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

  // Refs
  const updateIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isUsingMockData = useRef<boolean>(true);

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
      performance // Add performance metric
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
    const now = Date.now();
    const timeWindow = 5 * 60 * 1000; // 5 minutes window
    const cutoffTime = now - timeWindow;

    // Update bid price series
    setBidPriceSeries(current => {
      const filtered = current.filter(point => point.timestamp > cutoffTime);
      const newPoints = newBids.map(bid => ({
        timestamp: bid.timestamp,
        value: bid.bidPrice
      }));
      return [...filtered, ...newPoints].sort((a, b) => a.timestamp - b.timestamp);
    });

    // Update CTR series
    setCtrSeries(current => {
      const filtered = current.filter(point => point.timestamp > cutoffTime);
      const newPoints = newBids.map(bid => ({
        timestamp: bid.timestamp,
        value: bid.ctr
      }));
      return [...filtered, ...newPoints].sort((a, b) => a.timestamp - b.timestamp);
    });

    // Update performance series
    setPerformanceSeries(current => {
      const filtered = current.filter(point => point.timestamp > cutoffTime);
      const newPoints = newBids.map(bid => ({
        timestamp: bid.timestamp,
        executionTime: bid.executionTime,
        performance: bid.performance || 0,
        successRate: bid.isWon ? 1 : 0
      }));
      return [...filtered, ...newPoints].sort((a, b) => a.timestamp - b.timestamp);
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

  // Import real data with time series update
  const importData = useCallback(async (data: string | File | BidData[]) => {
    try {
      setIsImporting(true);
      setIsPaused(true);
      
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
        updateIntervalRef.current = null;
      }

      let parsedData: BidData[];

      if (Array.isArray(data)) {
        // If data is already an array of BidData, use it directly
        parsedData = data;
      } else {
        // Handle string or File inputs
        let fileContent: string;
        if (data instanceof File) {
          fileContent = await data.text();
        } else if (typeof data === 'string') {
          fileContent = data;
        } else {
          throw new Error('Invalid input: expected string, File object, or BidData array');
        }

        if (!fileContent) {
          throw new Error('No data to import');
        }

        const lines = fileContent.trim().split('\n');
        console.log('Importing data, total lines:', lines.length);

        parsedData = lines
          .map((line, index) => {
            try {
              // Skip empty lines
              if (!line.trim()) {
                console.log('Skipping empty line at', index + 1);
                return null;
              }

              const parts = line.trim().split(',');
              if (parts.length !== 5) {
                console.error('Invalid line format at line', index + 1, ':', line);
                console.error('Expected 5 parts, got', parts.length);
                throw new Error('Invalid line format');
              }

              const [timestamp, adId, bidPrice, ctr, winStatus] = parts;
              
              // Parse timestamp (format: YYYYMMDDHHmmssSSS)
              const ts = timestamp.trim();
              if (ts.length !== 17) {
                throw new Error(`Invalid timestamp length: ${ts.length}, expected 17`);
              }

              const year = ts.substring(0, 4);
              const month = ts.substring(4, 6);
              const day = ts.substring(6, 8);
              const hour = ts.substring(8, 10);
              const minute = ts.substring(10, 12);
              const second = ts.substring(12, 14);
              const millisecond = ts.substring(14);
              
              const dateStr = `${year}-${month}-${day}T${hour}:${minute}:${second}.${millisecond}`;
              const parsedTimestamp = new Date(dateStr).getTime();

              if (isNaN(parsedTimestamp)) {
                console.error('Invalid timestamp at line', index + 1, ':', timestamp);
                throw new Error('Invalid timestamp format');
              }

              const parsedBidPrice = parseFloat(bidPrice.trim());
              if (isNaN(parsedBidPrice)) {
                console.error('Invalid bid price at line', index + 1, ':', bidPrice);
                throw new Error('Invalid bid price format');
              }

              const parsedCTR = parseFloat(ctr.trim());
              if (isNaN(parsedCTR)) {
                console.error('Invalid CTR at line', index + 1, ':', ctr);
                throw new Error('Invalid CTR format');
              }

              const bid: BidData = {
                timestamp: parsedTimestamp,
                adId: adId.trim(),
                bidPrice: parsedBidPrice,
                ctr: parsedCTR,
                isWon: winStatus.trim() === '1',
                executionTime: 20 + Math.random() * 10,
                campaign: 'Imported Campaign'
              };
              return bid;
            } catch (err: unknown) {
              console.error('Error parsing line', index + 1, ':', line);
              console.error('Error details:', err);
              throw new Error(`Failed to parse line ${index + 1}: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
          })
          .filter((bid): bid is BidData => bid !== null);
      }

      console.log('Successfully processed', parsedData.length, 'records');

      if (parsedData.length === 0) {
        throw new Error('No valid data found in the import');
      }

      isUsingMockData.current = false;
      const recentData = parsedData.slice(-MAX_DATA_POINTS);
      setBidData(recentData);
      updateTimeSeries(recentData);
      
      console.log('Import completed successfully');
      
    } catch (error: unknown) {
      console.error('Error importing data:', error);
      throw new Error(`Failed to import data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsImporting(false);
      setIsPaused(true);
    }
  }, [updateTimeSeries]);

  // Update metrics and KPIs when bid data changes
  useEffect(() => {
    const newMetrics = calculateMetrics(bidData);
    const newKPIs = calculateCampaignKPIs(bidData);
    const newTimeMetrics = calculateTimeBasedMetrics(bidData);
    
    setMetrics(newMetrics);
    setCampaignKPIs(newKPIs);
    setTimeBasedMetrics(newTimeMetrics);
  }, [bidData, calculateMetrics, calculateCampaignKPIs, calculateTimeBasedMetrics]);

  // Handle mock data generation
  useEffect(() => {
    if (isUsingMockData.current && !isPaused) {
      const cleanup = startMockDataGeneration();
      return cleanup;
    }
    return undefined;
  }, [isPaused, startMockDataGeneration]);

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