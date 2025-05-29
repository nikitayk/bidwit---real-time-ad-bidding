import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface DataPoint {
  timestamp: string;
  ctr: number;
  cvr: number;
}

interface PerformanceChartProps {
  data: DataPoint[];
  timeRange: '1h' | '24h' | '7d' | '30d';
}

const PerformanceChart = ({ data, timeRange }: PerformanceChartProps) => {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    switch (timeRange) {
      case '1h':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '24h':
        return date.toLocaleString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
      case '30d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      default:
        return date.toLocaleString();
    }
  };

  const chartData = {
    labels: data.map(d => formatTimestamp(d.timestamp)),
    datasets: [
      {
        label: 'CTR (%)',
        data: data.map(d => d.ctr * 100),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y',
      },
      {
        label: 'CVR (%)',
        data: data.map(d => d.cvr * 100),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#f1f5f9',
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        padding: 12,
        boxPadding: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
          callback: (value: number) => `${value.toFixed(2)}%`,
        },
        title: {
          display: true,
          text: 'CTR',
          color: '#94a3b8',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: '#94a3b8',
          callback: (value: number) => `${value.toFixed(2)}%`,
        },
        title: {
          display: true,
          text: 'CVR',
          color: '#94a3b8',
        },
      },
    },
    animations: {
      radius: {
        duration: 400,
        easing: 'linear',
      },
    },
  };

  return (
    <div className="bg-dark-bg-secondary rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-dark-text-primary">Performance Trends</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-dark-text-secondary">Time Range:</span>
          <span className="text-sm font-medium text-dark-text-primary">
            {timeRange === '1h' ? 'Last Hour' :
             timeRange === '24h' ? 'Last 24 Hours' :
             timeRange === '7d' ? 'Last 7 Days' :
             'Last 30 Days'}
          </span>
        </div>
      </div>
      <div className="h-[400px]">
        <Line data={chartData} options={options} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-dark-bg-tertiary rounded-lg p-3">
          <div className="text-sm text-dark-text-secondary">Average CTR</div>
          <div className="text-xl font-semibold text-primary-500">
            {(data.reduce((acc, curr) => acc + curr.ctr, 0) / data.length * 100).toFixed(2)}%
          </div>
        </div>
        <div className="bg-dark-bg-tertiary rounded-lg p-3">
          <div className="text-sm text-dark-text-secondary">Average CVR</div>
          <div className="text-xl font-semibold text-green-500">
            {(data.reduce((acc, curr) => acc + curr.cvr, 0) / data.length * 100).toFixed(2)}%
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart; 