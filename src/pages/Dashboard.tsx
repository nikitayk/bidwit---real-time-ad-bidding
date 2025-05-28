import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useData } from '../context/DataContext';
import FileImport from '../components/FileImport';
import ImportGuide from '../components/ImportGuide';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { RiQuestionLine, RiPauseLine, RiPlayLine } from 'react-icons/ri';
import { FiInfo } from 'react-icons/fi';

// Lazy load heavy components
const Line = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));
const Bar = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));
const HelpGuide = lazy(() => import('../components/HelpGuide'));
const NFactor = lazy(() => import('../components/NFactor'));

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Performance optimizations for Chart.js
ChartJS.defaults.color = '#fff';
ChartJS.defaults.borderColor = 'rgba(255, 255, 255, 0.1)';
ChartJS.defaults.font.family = 'Inter, sans-serif';
ChartJS.defaults.animation = false; // Disable animations for better performance

const Dashboard: React.FC = () => {
  const [showHelp, setShowHelp] = useState(false);
  const [showImportGuide, setShowImportGuide] = useState(false);
  const {
    bidData,
    metrics,
    campaigns,
    campaignKPIs,
    selectedCampaign,
    setSelectedCampaign,
    dateRange,
    setDateRange,
    nFactor,
    setNFactor,
    isPaused,
    setIsPaused,
    isImporting
  } = useData();

  // Memoize filter function with throttling
  const filterData = useCallback((data: typeof bidData) => {
    return data.filter(bid => {
      const bidTime = typeof bid.timestamp === 'number' ? bid.timestamp : new Date(bid.timestamp).getTime();
      const inDateRange = bidTime >= dateRange[0].getTime() && 
                         bidTime <= dateRange[1].getTime();
      const inCampaign = selectedCampaign === 'all' || bid.campaign === selectedCampaign;
      return inDateRange && inCampaign;
    });
  }, [dateRange, selectedCampaign]);

  // Memoize filtered data with limit
  const filteredData = useMemo(() => {
    const filtered = filterData(bidData);
    return filtered.slice(-100); // Only show last 100 items for performance
  }, [filterData, bidData]);

  // Memoize chart data with sampling
  const chartData = useMemo(() => {
    const dataPoints = filteredData.length;
    const samplingRate = Math.ceil(dataPoints / 50); // Sample to max 50 points
    return filteredData.filter((_, index) => index % samplingRate === 0);
  }, [filteredData]);

  // Memoize performance data
  const performanceData = useMemo(() => ({
    labels: chartData.map(bid => new Date(bid.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Bid Price ($)',
        data: chartData.map(bid => bid.bidPrice),
        borderColor: '#00f3ff',
        backgroundColor: 'rgba(0, 243, 255, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y',
        pointRadius: 0,
        pointHoverRadius: 4,
      },
      {
        label: 'CTR (%)',
        data: chartData.map(bid => bid.ctr * 100),
        borderColor: '#00ff9d',
        backgroundColor: 'rgba(0, 255, 157, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        yAxisID: 'y1',
        pointRadius: 0,
        pointHoverRadius: 4,
      }
    ]
  }), [chartData]);

  // Memoize campaign data
  const campaignData = useMemo(() => ({
    labels: campaignKPIs.map(kpi => kpi.name),
    datasets: [
      {
        label: 'Win Rate (%)',
        data: campaignKPIs.map(kpi => kpi.winRate),
        backgroundColor: 'rgba(0, 243, 255, 0.5)',
        borderRadius: 4,
      },
      {
        label: 'CTR (%)',
        data: campaignKPIs.map(kpi => kpi.averageCTR * 100),
        backgroundColor: 'rgba(0, 255, 157, 0.5)',
        borderRadius: 4,
      }
    ]
  }), [campaignKPIs]);

  // Memoize chart options
  const lineChartOptions = useMemo<ChartOptions<'line'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    animation: {
      duration: 0
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Bid Price ($)',
          color: '#00f3ff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888',
          callback: (value) => `$${value}`
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'CTR (%)',
          color: '#00ff9d'
        },
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: '#888',
          callback: (value) => `${value}%`
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        displayColors: true,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${label.includes('$') ? '$' : ''}${value.toFixed(2)}${label.includes('%') ? '%' : ''}`;
          }
        }
      }
    }
  }), []);

  // Memoize bar chart options
  const barChartOptions = useMemo<ChartOptions<'bar'>>(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#fff',
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)}%`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888',
          callback: (value) => `${value}%`
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#888'
        }
      }
    }
  }), []);

  // Memoized handlers
  const handleDateRangeStart = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange([new Date(e.target.value), dateRange[1]]);
  }, [dateRange, setDateRange]);

  const handleDateRangeEnd = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDateRange([dateRange[0], new Date(e.target.value)]);
  }, [dateRange, setDateRange]);

  const handleCampaignChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCampaign(e.target.value);
  }, [setSelectedCampaign]);

  // Virtualized bid console row renderer
  const BidRow = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const bid = filteredData[filteredData.length - 1 - index];
    if (!bid) return null;

    return (
      <div
        style={style}
        className={`p-2 border ${
          bid.isWon ? 'border-soft-pink bg-soft-pink/5' : 'border-cyber-pink bg-cyber-pink/5'
        } rounded transition-all duration-300 hover:animate-glow`}
      >
        <div className="flex justify-between text-sm">
          <span>{new Date(bid.timestamp).toLocaleTimeString()}</span>
          <span className={bid.isWon ? 'text-soft-pink' : 'text-cyber-pink'}>
            ${bid.bidPrice.toFixed(2)}
          </span>
        </div>
        <div className="text-xs text-gray-400 flex justify-between mt-1">
          <span>{bid.campaign}</span>
          <span>CTR: {(bid.ctr * 100).toFixed(2)}%</span>
        </div>
        <div className="text-xs text-soft-purple mt-1">
          Execution Time: {bid.executionTime.toFixed(2)}ms
        </div>
      </div>
    );
  }, [filteredData]);

  // Add pause/resume button
  const togglePause = useCallback(() => {
    setIsPaused((prev: boolean) => !prev);
  }, [setIsPaused]);

  return (
    <div className="min-h-screen bg-cyber-dark text-white p-2 md:p-6 pt-4 md:pt-12">
      <div className="max-w-[1920px] mx-auto">
        {/* Status Banner */}
        {isImporting && (
          <div className="fixed top-0 left-0 right-0 bg-cyber-pink/90 text-white py-2 px-4 text-center z-50 text-sm md:text-base">
            Importing data... Please wait
          </div>
        )}

        {/* Data Source Indicator */}
        <div className="mb-4 md:mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-0">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${isPaused ? 'bg-cyber-pink' : 'bg-soft-pink animate-pulse'}`} />
            <span className="text-xs md:text-sm">
              {isPaused ? 'Updates Paused' : 'Live Updates Active'}
            </span>
          </div>
          <div className="text-xs md:text-sm text-soft-purple">
            {bidData.length > 0 ? `Showing ${bidData.length} records` : 'No data available'}
          </div>
        </div>

        {/* Help and Control Buttons */}
        <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 flex gap-2 z-[90]">
          <button
            onClick={togglePause}
            className="bg-gradient-sparkle p-3 md:p-4 rounded-full shadow-lg hover:animate-glow transition-all duration-300 hover:scale-110"
            aria-label={isPaused ? "Resume Updates" : "Pause Updates"}
          >
            {isPaused ? (
              <RiPlayLine className="w-5 h-5 md:w-6 md:h-6" />
            ) : (
              <RiPauseLine className="w-5 h-5 md:w-6 md:h-6" />
            )}
          </button>
          <button
            onClick={() => setShowHelp(true)}
            className="bg-gradient-sparkle p-3 md:p-4 rounded-full shadow-lg hover:animate-glow transition-all duration-300 hover:scale-110"
            aria-label="Open Help Guide"
          >
            <RiQuestionLine className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Help Guide */}
        <Suspense fallback={<div>Loading...</div>}>
          {showHelp && <HelpGuide onClose={() => setShowHelp(false)} />}
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
          {/* Main Metrics */}
          <div className="lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
            <div className="metric-card p-3 md:p-4">
              <h3 className="text-neon-pink mb-2 animate-shimmer text-sm md:text-base">Total Bids</h3>
              <p className="metric-value text-lg md:text-xl">{metrics.totalBids}</p>
              <div className="flex justify-between text-xs md:text-sm mt-2">
                <span className="text-soft-pink">Won: {metrics.successfulBids}</span>
                <span className="text-cyber-pink">Lost: {metrics.failedBids}</span>
              </div>
            </div>
            <div className="metric-card p-3 md:p-4">
              <h3 className="text-neon-purple mb-2 animate-shimmer text-sm md:text-base">Win Rate</h3>
              <p className="metric-value text-lg md:text-xl">{metrics.winRate.toFixed(2)}%</p>
              <p className="text-xs md:text-sm text-soft-purple mt-2">
                Avg. Execution: {metrics.averageExecutionTime.toFixed(2)}ms
              </p>
            </div>
            <div className="metric-card p-3 md:p-4">
              <h3 className="text-neon-pink mb-2 animate-shimmer text-sm md:text-base">Budget</h3>
              <p className="metric-value text-lg md:text-xl">${metrics.remainingBudget.toFixed(2)}</p>
              <div className="flex justify-between text-xs md:text-sm mt-2">
                <span className="text-soft-purple">Total: ${metrics.totalBudget}</span>
                <span className="text-soft-pink">Spent: ${(metrics.totalBudget - metrics.remainingBudget).toFixed(2)}</span>
              </div>
            </div>
            <div className="metric-card p-3 md:p-4">
              <h3 className="text-neon-purple mb-2 animate-shimmer text-sm md:text-base">Bid Metrics</h3>
              <p className="metric-value text-lg md:text-xl">${metrics.averageBidPrice.toFixed(2)}</p>
              <p className="text-xs md:text-sm text-soft-purple mt-2">
                Average Bid Price | CTR: {(metrics.averageCTR * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="lg:col-span-12 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4 md:mb-6">
            <div className="flex flex-wrap gap-3 md:gap-4 items-center w-full md:w-auto">
              <select
                value={selectedCampaign}
                onChange={handleCampaignChange}
                className="bg-cyber-darker border border-neon-blue/30 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-white text-sm md:text-base focus:outline-none focus:border-neon-blue w-full sm:w-auto"
              >
                <option value="all">All Campaigns</option>
                {campaigns.map(campaign => (
                  <option key={campaign} value={campaign}>
                    {campaign}
                  </option>
                ))}
              </select>

              <Suspense fallback={<div>Loading...</div>}>
                <NFactor
                  value={nFactor}
                  onChange={setNFactor}
                  onHelpClick={() => setShowHelp(true)}
                />
              </Suspense>

              <div className="flex items-center gap-3 md:gap-4 w-full sm:w-auto">
                <FileImport />
                <button
                  onClick={() => setShowImportGuide(true)}
                  className="bg-gradient-to-r from-neon-purple to-neon-pink px-3 py-1.5 md:px-4 md:py-2 rounded-lg shadow-lg hover:animate-glow transition-all duration-300 flex items-center gap-2 text-white font-medium border border-neon-pink/30 text-sm md:text-base w-full sm:w-auto justify-center"
                >
                  <FiInfo className="w-4 h-4 md:w-5 md:h-5" />
                  Import Guide
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 items-start sm:items-center w-full md:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="date"
                  value={dateRange[0].toISOString().split('T')[0]}
                  onChange={handleDateRangeStart}
                  className="bg-cyber-darker border border-neon-blue/30 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-white text-sm md:text-base focus:outline-none focus:border-neon-blue w-full sm:w-auto"
                />
                <span className="text-soft-blue text-sm md:text-base">to</span>
                <input
                  type="date"
                  value={dateRange[1].toISOString().split('T')[0]}
                  onChange={handleDateRangeEnd}
                  className="bg-cyber-darker border border-neon-blue/30 rounded-lg px-3 py-1.5 md:px-4 md:py-2 text-white text-sm md:text-base focus:outline-none focus:border-neon-blue w-full sm:w-auto"
                />
              </div>
            </div>
          </div>

          {/* Import Guide */}
          <ImportGuide isOpen={showImportGuide} onClose={() => setShowImportGuide(false)} />

          {/* Charts */}
          <div className="lg:col-span-8 space-y-4 md:space-y-6">
            <div className="cyber-card p-3 md:p-4 hover:animate-glow transition-all duration-300 border border-neon-pink/30">
              <h3 className="text-neon-pink mb-3 md:mb-4 animate-shimmer text-sm md:text-base">Bid Performance</h3>
              <div className="h-[300px] md:h-[400px]">
                <Suspense fallback={<div>Loading chart...</div>}>
                  <Line data={performanceData} options={lineChartOptions} />
                </Suspense>
              </div>
            </div>
            <div className="cyber-card p-3 md:p-4 hover:animate-glow transition-all duration-300 border border-neon-purple/30">
              <h3 className="text-neon-purple mb-3 md:mb-4 animate-shimmer text-sm md:text-base">Campaign Performance</h3>
              <div className="h-[250px] md:h-[300px]">
                <Suspense fallback={<div>Loading chart...</div>}>
                  <Bar data={campaignData} options={barChartOptions} />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Bid Console and Campaign KPIs */}
          <div className="lg:col-span-4 space-y-4 md:space-y-6">
            <div className="cyber-card p-3 md:p-4 hover:animate-glow transition-all duration-300 border border-neon-pink/30">
              <h3 className="text-neon-pink mb-3 md:mb-4 animate-shimmer text-sm md:text-base">Live Bid Console</h3>
              <div className="h-[250px] md:h-[300px]">
                <AutoSizer>
                  {({ height, width }: { height: number; width: number }) => (
                    <List
                      height={height}
                      width={width}
                      itemCount={Math.min(filteredData.length, 100)}
                      itemSize={70}
                    >
                      {BidRow}
                    </List>
                  )}
                </AutoSizer>
              </div>
            </div>

            <div className="cyber-card p-3 md:p-4 hover:animate-glow transition-all duration-300 border border-neon-purple/30">
              <h3 className="text-neon-purple mb-3 md:mb-4 animate-shimmer text-sm md:text-base">Campaign KPIs</h3>
              <div className="space-y-3 md:space-y-4">
                {campaignKPIs.map(kpi => (
                  <div key={kpi.name} className="p-2 md:p-3 border border-soft-purple/20 rounded hover:animate-glow transition-all duration-300">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-bold text-soft-purple text-sm md:text-base">{kpi.name}</h4>
                      <span className="text-xs md:text-sm text-soft-pink">
                        ${kpi.totalSpent.toFixed(2)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                      <div>
                        <p className="text-neon-pink">Win Rate</p>
                        <p className="text-soft-pink">{kpi.winRate.toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-neon-purple">Avg. CTR</p>
                        <p className="text-soft-purple">{(kpi.averageCTR * 100).toFixed(2)}%</p>
                      </div>
                      <div>
                        <p className="text-neon-pink">Total Bids</p>
                        <p className="text-soft-pink">{kpi.totalBids}</p>
                      </div>
                      <div>
                        <p className="text-neon-purple">Avg. Bid</p>
                        <p className="text-soft-purple">${kpi.averageBidPrice.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 