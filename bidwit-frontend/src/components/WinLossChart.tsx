import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface WinLossChartProps {
  wonBids: number;
  lostBids: number;
}

function WinLossChart({ wonBids, lostBids }: WinLossChartProps) {
  const data = {
    labels: ['Won', 'Lost'],
    datasets: [
      {
        data: [wonBids, lostBids],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'rgb(156, 163, 175)', // text-dark-text-secondary
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = wonBids + lostBids;
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="bg-dark-bg-secondary p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-dark-text-primary">Win/Loss Ratio</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[rgba(75,192,192,0.8)] mr-2"></div>
            <span className="text-sm text-dark-text-secondary">
              {((wonBids / (wonBids + lostBids || 1)) * 100).toFixed(1)}% Won
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[rgba(255,99,132,0.8)] mr-2"></div>
            <span className="text-sm text-dark-text-secondary">
              {((lostBids / (wonBids + lostBids || 1)) * 100).toFixed(1)}% Lost
            </span>
          </div>
        </div>
      </div>
      <div className="h-[300px]">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}

export default WinLossChart; 