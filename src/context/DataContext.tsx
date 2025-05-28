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

// Constants for data management
const MAX_STORED_BIDS = 200; // Further reduced for smoother performance
const UPDATE_INTERVAL = 3000; // Adjusted to 3 seconds for balance
const METRICS_UPDATE_DELAY = 300; // Reduced for faster updates
const IMPORT_CHUNK_SIZE = 5000; // Increased for faster imports

const CAMPAIGN_PRICES: { [key: string]: number } = {
  'Mobile App Campaign': 5,
  'Website Retargeting': 3,
  'Social Media Ads': 4
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State declarations
  const [activeBidData, setActiveBidData] = useState<BidData[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>(defaultMetrics);
  const [campaigns, setCampaigns] = useState<string[]>([]);
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

  // Base functions
  const addNewData = useCallback((newData: BidData[]) => {
    setActiveBidData(currentData => {
      const combinedData = [...currentData, ...newData];
      if (combinedData.length > MAX_STORED_BIDS) {
        return combinedData.slice(-MAX_STORED_BIDS);
      }
      return combinedData;
    });
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

  const updateMetrics = useCallback((data: BidData[]) => {
    if (metricsTimeoutRef.current) {
      clearTimeout(metricsTimeoutRef.current);
    }

    metricsTimeoutRef.current = setTimeout(() => {
      const metrics = calculateMetrics(data);
      const kpis = calculateCampaignKPIs(data);
      
      requestAnimationFrame(() => {
        setMetrics(metrics);
        setCampaignKPIs(kpis);
      });
    }, METRICS_UPDATE_DELAY);
  }, [calculateMetrics, calculateCampaignKPIs]);

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

  // Data generation
  const generateDemoBid = useCallback((lastTimestamp: number): BidData => {
    const campaign = campaigns[Math.floor(Math.random() * campaigns.length)];
    const basePrice = CAMPAIGN_PRICES[campaign] || 4; // Default to 4 if campaign not found
    const variance = basePrice * 0.2;
    
    return {
      timestamp: lastTimestamp + UPDATE_INTERVAL,
      bidPrice: (basePrice + (Math.random() * variance * 2 - variance)) * nFactor,
      isWon: Math.random() > 0.4,
      ctr: 0.02 + (Math.random() * 0.06),
      campaign,
      executionTime: 20 + Math.random() * 30,
    };
  }, [campaigns, nFactor]);

  const generateInitialDemoData = useCallback((count: number): BidData[] => {
    const now = Date.now();
    const availableCampaigns = Object.keys(CAMPAIGN_PRICES);
    
    return Array.from({ length: count }, (_, i) => {
      const campaign = availableCampaigns[Math.floor(Math.random() * availableCampaigns.length)];
      const basePrice = CAMPAIGN_PRICES[campaign];
      const variance = basePrice * 0.2;
      
      return {
        timestamp: now - (count - i) * 2000,
        bidPrice: basePrice + (Math.random() * variance * 2 - variance),
        isWon: Math.random() > 0.4,
        ctr: 0.02 + (Math.random() * 0.06),
        campaign,
        executionTime: 20 + Math.random() * 30,
      };
    });
  }, []);

  // Real-time updates
  const startRealTimeUpdates = useCallback(() => {
    if (isImporting || isPaused) return () => {};

    const intervalId = setInterval(() => {
      if (document.hidden) return;

      requestAnimationFrame(() => {
        const lastTimestamp = activeBidData[activeBidData.length - 1]?.timestamp || Date.now();
        const newBid = generateDemoBid(lastTimestamp);
        addNewData([newBid]);
        updateMetrics([...activeBidData, newBid]);
      });
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isImporting, isPaused, activeBidData, addNewData, generateDemoBid, updateMetrics]);

  // Data import
  const importData = useCallback(async (newData: BidData[]) => {
    try {
      setIsImporting(true);
      setIsPaused(true);
      
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }

      setActiveBidData([]);
      historicalDataRef.current = [];

      const chunks = Math.ceil(newData.length / IMPORT_CHUNK_SIZE);
      for (let i = 0; i < chunks; i++) {
        const start = i * IMPORT_CHUNK_SIZE;
        const end = Math.min(start + IMPORT_CHUNK_SIZE, newData.length);
        const chunk = newData.slice(start, end);
        
        await new Promise<void>(resolve => {
          requestAnimationFrame(() => {
            addNewData(chunk);
            if (i === chunks - 1) {
              updateMetrics(chunk);
            }
            resolve();
          });
        });
      }

      const uniqueCampaigns = new Set(newData.map(bid => bid.campaign));
      setCampaigns(Array.from(uniqueCampaigns));

    } catch (error) {
      console.error('Error importing data:', error);
      throw new Error('Failed to import data. Please check the file format.');
    } finally {
      setIsImporting(false);
      setIsPaused(true);
    }
  }, [addNewData, updateMetrics]);

  // Initialize demo data
  useEffect(() => {
    const demoData = generateInitialDemoData(50);
    addNewData(demoData);
    setCampaigns(Object.keys(CAMPAIGN_PRICES));
    updateMetrics(demoData);
    cleanupRef.current = startRealTimeUpdates();
  }, [addNewData, generateInitialDemoData, startRealTimeUpdates, updateMetrics]);

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