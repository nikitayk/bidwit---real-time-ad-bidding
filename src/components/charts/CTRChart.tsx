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
  Filler
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

interface CTRChartProps {
  data: {
    timestamp: string;
    ctr: number;
  }[];
}

export default function CTRChart({ data }: CTRChartProps) {
  const chartData = {
    labels: data.map(d => {
      const date = new Date(d.timestamp);
      return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }),
    datasets: [
      {
        label: 'CTR %',
        data: data.map(d => d.ctr),
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9ca3af',
        },
      },
      title: {
        display: true,
        text: 'Click-Through Rate Trend',
        color: '#9ca3af',
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
      y: {
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#9ca3af',
        },
      },
    },
  };

  return (
    <div className="bg-dark-bg-secondary p-4 rounded-lg shadow-lg">
      <div className="h-[300px]">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
} 