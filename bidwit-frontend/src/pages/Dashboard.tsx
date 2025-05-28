import { useState, useRef, useCallback, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { List, AutoSizer } from 'react-virtualized';
import { QuestionMarkCircleIcon, PlayIcon, StopIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import HelpModal from '../components/HelpModal';
import NFactor from '../components/NFactor';
import WinLossChart from '../components/WinLossChart';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface BidData {
  timestamp: string;
  ad_id: string;
  bid_price: number;
  ctr: number;
  win_status: number;
  conversion?: boolean; // Optional conversion status
  cost?: number; // Optional cost for CPC calculation
}

function Dashboard() {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLiveUpdate, setIsLiveUpdate] = useState(false);
  const [bidData, setBidData] = useState<BidData[]>([]);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [nFactor, setNFactor] = useState(1.0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const liveUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const totalBudget = 10000; // Example budget amount

  const campaigns = [
    { id: 'summer2025', name: 'Summer Promotion 2025' },
    { id: 'winter2025', name: 'Winter Campaign 2025' },
  ];

  // Live update effect
  useEffect(() => {
    if (isLiveUpdate) {
      liveUpdateTimeoutRef.current = setTimeout(() => {
        setIsLiveUpdate(false);
      }, 60000); // Auto-stop after 1 minute
    }
    return () => {
      if (liveUpdateTimeoutRef.current) {
        clearTimeout(liveUpdateTimeoutRef.current);
      }
    };
  }, [isLiveUpdate]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n');
      const parsedData: BidData[] = lines
        .filter(line => line.trim())
        .map(line => {
          const [timestamp, ad_id, bid_price, ctr, win_status] = line.split(',');
          return {
            timestamp,
            ad_id,
            bid_price: parseFloat(bid_price),
            ctr: parseFloat(ctr),
            win_status: parseInt(win_status),
          };
        });

      setBidData(parsedData);
      setIsProcessing(false);
    };

    reader.readAsText(file);
  };

  const renderBidRow = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const bid = bidData[index];
    return (
      <div
        style={style}
        className={`flex items-center px-4 py-2 ${
          index % 2 === 0 ? 'bg-dark-bg-secondary' : 'bg-dark-bg-tertiary'
        }`}
      >
        <div className="w-1/4">{new Date(bid.timestamp).toLocaleString()}</div>
        <div className="w-1/4">{bid.ad_id.substring(0, 8)}...</div>
        <div className="w-1/4">${bid.bid_price.toFixed(2)}</div>
        <div className={`w-1/4 ${bid.win_status ? 'text-green-500' : 'text-red-500'}`}>
          {bid.win_status ? 'Won' : 'Lost'}
        </div>
      </div>
    );
  }, [bidData]);

  const chartData = {
    labels: bidData.slice(-50).map(d => new Date(d.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'CTR',
        data: bidData.slice(-50).map(d => d.ctr),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
      },
    ],
  };

  const bidPriceData = {
    labels: ['0-100', '101-200', '201-300', '301-400', '401+'],
    datasets: [
      {
        label: 'Bid Price Distribution',
        data: [
          bidData.filter(d => d.bid_price <= 100).length,
          bidData.filter(d => d.bid_price > 100 && d.bid_price <= 200).length,
          bidData.filter(d => d.bid_price > 200 && d.bid_price <= 300).length,
          bidData.filter(d => d.bid_price > 300 && d.bid_price <= 400).length,
          bidData.filter(d => d.bid_price > 400).length,
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
      },
    ],
  };

  // Enhanced metrics calculation
  const metrics = {
    impressions: bidData.length,
    clicks: Math.round(bidData.reduce((acc, curr) => acc + curr.ctr, 0)),
    conversions: bidData.filter(d => d.conversion).length,
    avgCTR: (bidData.reduce((acc, curr) => acc + curr.ctr, 0) / bidData.length || 0).toFixed(2),
    cvr: ((bidData.filter(d => d.conversion).length / bidData.length) * 100 || 0).toFixed(2),
    cpc: (bidData.reduce((acc, curr) => acc + (curr.cost || 0), 0) / 
          Math.round(bidData.reduce((acc, curr) => acc + curr.ctr, 0)) || 0).toFixed(2),
    totalBids: bidData.length,
    wonBids: bidData.filter(d => d.win_status === 1).length,
    avgBidPrice: (bidData.reduce((acc, curr) => acc + curr.bid_price, 0) / bidData.length || 0).toFixed(2),
    budgetUsed: (bidData.reduce((acc, curr) => acc + curr.bid_price * (curr.win_status === 1 ? 1 : 0), 0)).toFixed(2),
    budgetUsagePercent: ((bidData.reduce((acc, curr) => acc + curr.bid_price * (curr.win_status === 1 ? 1 : 0), 0) / totalBudget) * 100).toFixed(1),
  };

  // Export functionality
  const handleExport = (format: 'csv' | 'json') => {
    const data = format === 'csv' 
      ? convertToCSV(bidData)
      : JSON.stringify(bidData, null, 2);
    
    const blob = new Blob([data], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bidwit-export.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const convertToCSV = (data: BidData[]) => {
    const headers = ['timestamp', 'ad_id', 'bid_price', 'ctr', 'win_status', 'conversion', 'cost'];
    const rows = data.map(item => 
      headers.map(header => item[header as keyof BidData] ?? '').join(',')
    );
    return [headers.join(','), ...rows].join('\n');
  };

  // Budget usage chart data
  const budgetData = {
    labels: ['Used', 'Remaining'],
    datasets: [{
      data: [
        parseFloat(metrics.budgetUsed),
        Math.max(0, totalBudget - parseFloat(metrics.budgetUsed))
      ],
      backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(228, 228, 228, 0.2)'],
      borderWidth: 0,
    }],
  };

  return (
    <div className="space-y-6">
      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Header with Controls */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-dark-text-primary">Campaign Dashboard</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsLiveUpdate(!isLiveUpdate)}
            className={`inline-flex items-center px-3 py-2 border border-dark-border rounded-md text-sm font-medium ${
              isLiveUpdate ? 'bg-red-600 text-white' : 'text-dark-text-primary hover:bg-dark-bg-tertiary'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            {isLiveUpdate ? (
              <><StopIcon className="h-5 w-5 mr-2" />Stop Live Updates</>
            ) : (
              <><PlayIcon className="h-5 w-5 mr-2" />Start Live Updates</>
            )}
          </button>
          <div className="relative">
            <button
              onClick={() => handleExport('csv')}
              className="inline-flex items-center px-3 py-2 border border-dark-border rounded-md text-sm font-medium text-dark-text-primary hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
          <button
            onClick={() => setIsHelpOpen(true)}
            className="inline-flex items-center px-3 py-2 border border-dark-border rounded-md text-sm font-medium text-dark-text-primary hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <QuestionMarkCircleIcon className="h-5 w-5 mr-2" />
            Help
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="md:col-span-2 lg:col-span-1">
          <label className="block text-sm font-medium text-dark-text-secondary mb-1">
            Campaign
          </label>
          <select
            value={selectedCampaign}
            onChange={(e) => setSelectedCampaign(e.target.value)}
            className="block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Select Campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-1">
            Start Date
          </label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-1">
            End Date
          </label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            className="block w-full px-3 py-2 bg-dark-bg-tertiary border border-dark-border rounded-md text-dark-text-primary focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div>
          <NFactor value={nFactor} onChange={setNFactor} />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-text-secondary mb-1">
            Import Data
          </label>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Upload File'}
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Object.entries(metrics).map(([key, value]) => (
          <div
            key={key}
            className="bg-dark-bg-secondary p-4 rounded-lg shadow-sm"
          >
            <h3 className="text-sm font-medium text-dark-text-secondary capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="mt-1 text-2xl font-semibold text-dark-text-primary">
              {key === 'budgetUsagePercent' ? `${value}%` :
               key === 'cpc' || key === 'budgetUsed' ? `$${value}` :
               typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-bg-secondary p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-dark-text-primary mb-4">CTR Trend</h3>
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>
        <div className="bg-dark-bg-secondary p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-dark-text-primary mb-4">Bid Price Distribution</h3>
          <Bar data={bidPriceData} options={{ responsive: true, maintainAspectRatio: false }} height={300} />
        </div>
        
        {/* Budget Usage Ring */}
        <div className="bg-dark-bg-secondary p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-dark-text-primary mb-4">Budget Usage</h3>
          <div className="relative" style={{ height: '300px' }}>
            <Doughnut
              data={budgetData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                  legend: {
                    display: false
                  },
                }
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-dark-text-primary">
                  {metrics.budgetUsagePercent}%
                </div>
                <div className="text-sm text-dark-text-secondary">Used</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WinLossChart
          wonBids={bidData.filter(d => d.win_status === 1).length}
          lostBids={bidData.filter(d => d.win_status === 0).length}
        />
        <div className="bg-dark-bg-secondary p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-dark-text-primary mb-4">Live Bid Console</h3>
          <div className="h-[300px] border border-dark-border rounded-lg overflow-hidden">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={bidData.length}
                  rowHeight={40}
                  rowRenderer={renderBidRow}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 