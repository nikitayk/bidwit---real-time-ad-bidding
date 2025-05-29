import { useState, useEffect } from 'react';
import { Line, Bar } from 'react-chartjs-2';
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
  Filler,
} from 'chart.js';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('24h');
  const [analyticsData, setAnalyticsData] = useState({
    revenue: { current: 0, previous: 0 },
    impressions: { current: 0, previous: 0 },
    clicks: { current: 0, previous: 0 },
    conversions: { current: 0, previous: 0 },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/analytics?timeRange=${timeRange}`);
        const data = await response.json();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
      setIsLoading(false);
    };

    fetchAnalyticsData();
  }, [timeRange]);

  const revenueData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12000, 19000, 15000, 25000, 22000, 30000, 28000],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.4,
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
      },
    ],
  };

  const conversionData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Conversions',
        data: [150, 230, 180, 290, 270, 320, 300],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f1f5f9',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  const calculatePercentageChange = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const MetricCard = ({ title, current, previous, format = 'number' }) => {
    const percentageChange = calculatePercentageChange(current, previous);
    const isPositive = percentageChange >= 0;

    return (
      <div className="bg-dark-bg-secondary p-6 rounded-lg shadow-lg">
        <h3 className="text-dark-text-secondary text-sm font-medium">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <p className="text-2xl font-semibold text-dark-text-primary">
            {format === 'currency' ? `$${current.toLocaleString()}` : current.toLocaleString()}
          </p>
          <span className={`ml-2 flex items-center text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpIcon className="h-4 w-4" /> : <ArrowDownIcon className="h-4 w-4" />}
            {Math.abs(percentageChange).toFixed(1)}%
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end space-x-2">
        {(['24h', '7d', '30d', '90d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              timeRange === range
                ? 'bg-primary-500 text-white'
                : 'bg-dark-bg-tertiary text-dark-text-secondary hover:text-dark-text-primary'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Revenue"
          current={analyticsData.revenue.current}
          previous={analyticsData.revenue.previous}
          format="currency"
        />
        <MetricCard
          title="Impressions"
          current={analyticsData.impressions.current}
          previous={analyticsData.impressions.previous}
        />
        <MetricCard
          title="Clicks"
          current={analyticsData.clicks.current}
          previous={analyticsData.clicks.previous}
        />
        <MetricCard
          title="Conversions"
          current={analyticsData.conversions.current}
          previous={analyticsData.conversions.previous}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-bg-secondary p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-dark-text-primary mb-4">Revenue Trend</h3>
          <div className="h-80">
            <Line data={revenueData} options={chartOptions} />
          </div>
        </div>
        <div className="bg-dark-bg-secondary p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-medium text-dark-text-primary mb-4">Conversion Trend</h3>
          <div className="h-80">
            <Bar data={conversionData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 