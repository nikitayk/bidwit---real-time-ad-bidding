import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

interface BidData {
  timestamp: number;
  bidPrice: number;
  isWon: boolean;
  ctr: number;
  campaign: string;
  executionTime: number;
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
}

interface CampaignKPI {
  name: string;
  totalBids: number;
  winRate: number;
  averageCTR: number;
  totalSpent: number;
  averageBidPrice: number;
}

interface DataContextType {
  bidData: BidData[];
  metrics: MetricsData;
  campaigns: string[];
  campaignKPIs: CampaignKPI[];
  importData: (data: BidData[]) => Promise<void>;
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

const defaultMetrics: MetricsData = {
  totalBids: 0,
  winRate: 0,
  averageCTR: 0,
  averageBidPrice: 0,
  activeCampaigns: 0,
  totalBudget: 10000,
  remainingBudget: 10000,
  averageExecutionTime: 0,
  successfulBids: 0,
  failedBids: 0,
  totalBidAmount: 0,
};

// Constants for data management - ULTRA SLOW SETTINGS
const MAX_STORED_BIDS = 20; // Bare minimum stored bids
const UPDATE_INTERVAL = 60000; // Full minute between updates
const METRICS_UPDATE_DELAY = 10000; // 10 second delay for metrics
const IMPORT_CHUNK_SIZE = 500; // Tiny import chunks
const MAX_VISIBLE_POINTS = 5; // Extremely few visible points
const MIN_UPDATE_INTERVAL = 45000; // Force 45 second minimum between ANY updates

// Demo data configuration with microscopic changes
const CAMPAIGN_PRICES: { [key: string]: number } = {
  'Mobile App Campaign': 5,
  'Website Retargeting': 3,
  'Social Media Ads': 4
};

// Microscopic variances for ultra stability
const PRICE_VARIANCE = 0.01; // Only 1% price variance
const CTR_VARIANCE = 0.005; // Half percent CTR variance
const EXEC_TIME_VARIANCE = 2; // Tiny execution time range
const INITIAL_DEMO_COUNT = 10; // Bare minimum initial points
const DEMO_WIN_RATE = 0.6; // 60% win rate
const DEMO_CTR_BASE = 0.02; // 2% base CTR

// Generate initial demo metrics
const generateDemoMetrics = (): MetricsData => ({
  totalBids: 0,
  winRate: 60,
  averageCTR: 0.04,
  averageBidPrice: 4,
  activeCampaigns: Object.keys(CAMPAIGN_PRICES).length,
  totalBudget: 10000,
  remainingBudget: 10000,
  averageExecutionTime: 35,
  successfulBids: 0,
  failedBids: 0,
  totalBidAmount: 0,
});

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State declarations with demo data
  const [activeBidData, setActiveBidData] = useState<BidData[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>(generateDemoMetrics());
  const [campaigns, setCampaigns] = useState<string[]>(Object.keys(CAMPAIGN_PRICES));
  const [campaignKPIs, setCampaignKPIs] = useState<CampaignKPI[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('all');
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  ]);
  const [nFactor, setNFactor] = useState<number>(1);
  const [isImporting, setIsImporting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Refs
  const cleanupRef = useRef<(() => void) | null>(null);
  const updateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const metricsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const historicalDataRef = useRef<BidData[]>([]);

  // Add throttle time tracking
  const lastUpdateRef = useRef<number>(Date.now());

  // Campaign KPIs calculation
  const calculateCampaignKPIs = useCallback((data: BidData[]) => {
    const campaignStats = data.reduce((acc, bid) => {
      if (!acc[bid.campaign]) {
        acc[bid.campaign] = {
          totalBids: 0,
          wonBids: 0,
          totalCTR: 0,
          totalSpent: 0,
          totalBidPrice: 0
        };
      }
      
      const stats = acc[bid.campaign];
      stats.totalBids++;
      stats.wonBids += bid.isWon ? 1 : 0;
      stats.totalCTR += bid.ctr;
      stats.totalSpent += bid.isWon ? bid.bidPrice : 0;
      stats.totalBidPrice += bid.bidPrice;
      
      return acc;
    }, {} as Record<string, {
      totalBids: number;
      wonBids: number;
      totalCTR: number;
      totalSpent: number;
      totalBidPrice: number;
    }>);

    return Object.entries(campaignStats).map(([name, stats]) => ({
      name,
      totalBids: stats.totalBids,
      winRate: (stats.wonBids / stats.totalBids) * 100,
      averageCTR: stats.totalCTR / stats.totalBids,
      totalSpent: stats.totalSpent,
      averageBidPrice: stats.totalBidPrice / stats.totalBids,
    }));
  }, []);

  // Metrics calculations
  const calculateMetrics = useCallback((data: BidData[]) => {
    if (data.length === 0) return defaultMetrics;

    const {
      wonBids,
      totalCTR,
      totalBidPrice,
      uniqueCampaigns,
      totalExecutionTime,
      spentBudget
    } = data.reduce((acc, bid) => ({
      wonBids: acc.wonBids + (bid.isWon ? 1 : 0),
      totalCTR: acc.totalCTR + bid.ctr,
      totalBidPrice: acc.totalBidPrice + bid.bidPrice,
      uniqueCampaigns: acc.uniqueCampaigns.add(bid.campaign),
      totalExecutionTime: acc.totalExecutionTime + bid.executionTime,
      spentBudget: acc.spentBudget + (bid.isWon ? bid.bidPrice : 0)
    }), {
      wonBids: 0,
      totalCTR: 0,
      totalBidPrice: 0,
      uniqueCampaigns: new Set<string>(),
      totalExecutionTime: 0,
      spentBudget: 0
    });

    const totalBids = data.length;

    return {
      totalBids,
      winRate: (wonBids / totalBids) * 100,
      averageCTR: totalCTR / totalBids,
      averageBidPrice: totalBidPrice / totalBids,
      activeCampaigns: uniqueCampaigns.size,
      totalBudget: defaultMetrics.totalBudget,
      remainingBudget: defaultMetrics.totalBudget - spentBudget,
      averageExecutionTime: totalExecutionTime / totalBids,
      successfulBids: wonBids,
      failedBids: totalBids - wonBids,
      totalBidAmount: totalBidPrice,
    };
  }, []);

  // Ultra-throttled metrics update with huge delays
  const updateMetrics = useCallback((data: BidData[]) => {
    const now = Date.now();
    
    // Extreme throttling
    if (now - lastUpdateRef.current < MIN_UPDATE_INTERVAL) {
      console.log('Update skipped - enforcing long delay');
      return;
    }

    if (metricsTimeoutRef.current) {
      clearTimeout(metricsTimeoutRef.current);
    }

    lastUpdateRef.current = now;

    // Initial delay before any processing
    setTimeout(() => {
      metricsTimeoutRef.current = setTimeout(() => {
        // Take absolute minimum points
        const recentData = data.slice(-MAX_VISIBLE_POINTS);
        
        const metrics = calculateMetrics(data);
        const kpis = calculateCampaignKPIs(data);
        
        // Multiple layers of delays
        setTimeout(() => {
          setTimeout(() => {
            requestAnimationFrame(() => {
              setMetrics(prev => ({
                ...metrics,
                // Ultra-smooth transitions (98% previous, 2% new)
                averageBidPrice: prev.averageBidPrice * 0.98 + metrics.averageBidPrice * 0.02,
                winRate: prev.winRate * 0.98 + metrics.winRate * 0.02,
                averageCTR: prev.averageCTR * 0.98 + metrics.averageCTR * 0.02,
                averageExecutionTime: prev.averageExecutionTime * 0.98 + metrics.averageExecutionTime * 0.02,
                // Strictly limited counts
                totalBids: Math.min(metrics.totalBids, MAX_STORED_BIDS),
                successfulBids: Math.min(metrics.successfulBids, MAX_STORED_BIDS),
                failedBids: Math.min(metrics.failedBids, MAX_STORED_BIDS),
                totalBidAmount: Math.round(metrics.totalBidAmount * 100) / 100,
                remainingBudget: Math.round(metrics.remainingBudget * 100) / 100,
                totalBudget: metrics.totalBudget,
                activeCampaigns: metrics.activeCampaigns
              }));
              
              // Super delayed KPI updates
              setTimeout(() => {
                setCampaignKPIs(kpis);
              }, 3000);
            });
          }, 2000);
        }, 2000);
      }, METRICS_UPDATE_DELAY);
    }, 3000);
  }, [calculateMetrics, calculateCampaignKPIs]);

  // Extremely slow data addition with multiple delays
  const addNewData = useCallback((newData: BidData[]) => {
    // Multiple layers of delay
    setTimeout(() => {
      setTimeout(() => {
        setActiveBidData(currentData => {
          const combinedData = [...currentData, ...newData].slice(-MAX_STORED_BIDS);
          return combinedData;
        });
      }, 3000);
    }, 3000);
  }, []);

  // Ultra-slow demo bid generation with tiny changes
  const generateDemoBid = useCallback((lastTimestamp: number): BidData => {
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const basePrice = CAMPAIGN_PRICES[campaign] || 4;
    
    // Microscopic changes
    const priceChange = (Math.random() * 2 - 1) * basePrice * PRICE_VARIANCE;
    
    return {
      timestamp: lastTimestamp + UPDATE_INTERVAL,
      bidPrice: Math.round((basePrice + priceChange) * nFactor * 100) / 100,
      isWon: Math.random() < 0.6,
      ctr: Number((DEMO_CTR_BASE + (Math.random() * CTR_VARIANCE)).toFixed(4)),
      campaign,
      executionTime: Math.round(30 + Math.random() * EXEC_TIME_VARIANCE),
    };
  }, [campaigns, nFactor]);

  // Glacially slow real-time updates
  const startRealTimeUpdates = useCallback(() => {
    if (isImporting || isPaused) return () => {};

    let lastUpdate = Date.now();
    const intervalId = setInterval(() => {
      const now = Date.now();
      
      // Multiple levels of aggressive throttling
      if (document.hidden || now - lastUpdate < MIN_UPDATE_INTERVAL) {
        console.log('Update skipped - enforcing long delay');
        return;
      }

      lastUpdate = now;

      // Multiple layers of delays
      setTimeout(() => {
        setTimeout(() => {
          setTimeout(() => {
            requestAnimationFrame(() => {
              const lastTimestamp = activeBidData[activeBidData.length - 1]?.timestamp || Date.now();
              const newBid = generateDemoBid(lastTimestamp);
              
              // Add single bid with multiple delays
              setTimeout(() => {
                addNewData([newBid]);
                
                // Super delayed metrics update
                setTimeout(() => {
                  const recentData = [...activeBidData.slice(-MAX_VISIBLE_POINTS), newBid];
                  updateMetrics(recentData);
                }, 5000);
              }, 3000);
            });
          }, 2000);
        }, 2000);
      }, 2000);
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isImporting, isPaused, activeBidData, addNewData, generateDemoBid, updateMetrics]);

  // Initialize with fewer demo records
  const generateInitialDemoData = useCallback((count: number): BidData[] => {
    const now = Date.now();
    const availableCampaigns = Object.keys(CAMPAIGN_PRICES);
    
    return Array.from({ length: count }, (_, i) => {
      const campaign = availableCampaigns[Math.floor(Math.random() * availableCampaigns.length)];
      const basePrice = CAMPAIGN_PRICES[campaign];
      const priceChange = (Math.random() * 2 - 1) * basePrice * PRICE_VARIANCE;
      
      // Spread over 7 days with bigger gaps
      const timeGap = Math.floor(7 * 24 * 60 * 60 * 1000 / count);
      const timestamp = now - (count - i) * timeGap;
      
      return {
        timestamp,
        bidPrice: basePrice + priceChange,
        isWon: Math.random() < DEMO_WIN_RATE,
        ctr: DEMO_CTR_BASE + (Math.random() * CTR_VARIANCE),
        campaign,
        executionTime: 30 + Math.random() * EXEC_TIME_VARIANCE,
      };
    });
  }, []);

  // Initialize demo data immediately
  useEffect(() => {
    const initializeDemoData = () => {
      const demoData = generateInitialDemoData(INITIAL_DEMO_COUNT);
      setActiveBidData(demoData);
      
      // Calculate initial KPIs
      const initialKPIs = calculateCampaignKPIs(demoData);
      setCampaignKPIs(initialKPIs);
      
      // Update metrics
      const initialMetrics = calculateMetrics(demoData);
      setMetrics(initialMetrics);
      
      // Start real-time updates
      cleanupRef.current = startRealTimeUpdates();
    };

    initializeDemoData();
    
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [generateInitialDemoData, calculateCampaignKPIs, calculateMetrics, startRealTimeUpdates]);

  // Data import with clear separation from demo data
  const importData = useCallback(async (newData: BidData[]) => {
    try {
      setIsImporting(true);
      setIsPaused(true);
      
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      // Clear all existing demo data
      setActiveBidData([]);
      historicalDataRef.current = [];
      setMetrics(generateDemoMetrics()); // Reset metrics
      setCampaignKPIs([]); // Reset KPIs

      // Process imported data
      const chunks = Math.ceil(newData.length / IMPORT_CHUNK_SIZE);
      for (let i = 0; i < chunks; i++) {
        const start = i * IMPORT_CHUNK_SIZE;
        const end = Math.min(start + IMPORT_CHUNK_SIZE, newData.length);
        const chunk = newData.slice(start, end);
        
        await new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            addNewData(chunk);
            if (i === chunks - 1) {
              // Update all metrics and KPIs after import
              const finalMetrics = calculateMetrics(chunk);
              const finalKPIs = calculateCampaignKPIs(chunk);
              setMetrics(finalMetrics);
              setCampaignKPIs(finalKPIs);
            }
            resolve();
          });
        });
      }

      // Update campaigns from imported data
      const uniqueCampaigns = new Set(newData.map(bid => bid.campaign));
      setCampaigns(Array.from(uniqueCampaigns));

    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      setIsPaused(true); // Keep updates paused after import
    }
  }, [addNewData, calculateMetrics, calculateCampaignKPIs]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (metricsTimeoutRef.current) {
        clearTimeout(metricsTimeoutRef.current);
      }
    };
  }, []);

  // Context value
  const contextValue = useMemo(() => ({
    bidData: activeBidData,
    metrics,
    campaigns,
    campaignKPIs,
    importData,
    selectedCampaign,
    setSelectedCampaign,
    dateRange,
    setDateRange,
    nFactor,
    setNFactor,
    isPaused,
    setIsPaused,
    isImporting,
  }), [
    activeBidData,
    metrics,
    campaigns,
    campaignKPIs,
    importData,
    selectedCampaign,
    dateRange,
    nFactor,
    isPaused,
    isImporting
  ]);

  return (
    <DataContext.Provider value={contextValue}>
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