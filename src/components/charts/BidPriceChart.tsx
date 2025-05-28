import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BidPriceChartProps {
  bids: Array<{
    timestamp: string;
    bidPrice: number;
    winStatus: number;
  }>;
}

const BidPriceChart: React.FC<BidPriceChartProps> = ({ bids }) => {
  const chartData = useMemo(() => {
    // Create bid price ranges
    const ranges = Array.from({ length: 10 }, (_, i) => i + 1);
    const counts = ranges.map(range => ({
      range,
      won: bids.filter(bid => 
        bid.bidPrice >= range && bid.bidPrice < range + 1 && bid.winStatus === 1
      ).length,
      lost: bids.filter(bid => 
        bid.bidPrice >= range && bid.bidPrice < range + 1 && bid.winStatus === 0
      ).length,
    }));

    return {
      labels: ranges.map(range => `$${range.toFixed(2)}-${(range + 1).toFixed(2)}`),
      datasets: [
        {
          label: 'Won Bids',
          data: counts.map(c => c.won),
          backgroundColor: 'var(--money-green)',
          borderColor: 'var(--money-green)',
          borderWidth: 1,
        },
        {
          label: 'Lost Bids',
          data: counts.map(c => c.lost),
          backgroundColor: 'var(--neon-pink)',
          borderColor: 'var(--neon-pink)',
          borderWidth: 1,
        },
      ],
    };
  }, [bids]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: '#ffffff',
          font: {
            family: "'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
            weight: 'bold' as const,
          },
        },
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: 'var(--cyber-darker)',
        titleColor: 'var(--neon-blue)',
        bodyColor: '#ffffff',
        borderColor: 'var(--neon-blue)',
        borderWidth: 1,
        padding: 12,
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
      y: {
        stacked: true,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: '#ffffff',
        },
      },
    },
  };

  return (
    <div>
      <h3 className="text-lg font-bold tracking-wider text-neon-blue neon-text mb-4">
        BID PRICE DISTRIBUTION
      </h3>
      <div className="h-[300px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default BidPriceChart; 