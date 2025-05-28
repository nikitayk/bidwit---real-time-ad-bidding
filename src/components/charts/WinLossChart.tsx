import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface WinLossChartProps {
  bids: Array<{
    winStatus: number;
  }>;
}

const WinLossChart: React.FC<WinLossChartProps> = ({ bids }) => {
  const chartData = useMemo(() => {
    const won = bids.filter(bid => bid.winStatus === 1).length;
    const lost = bids.filter(bid => bid.winStatus === 0).length;

    return {
      labels: ['Won', 'Lost'],
      datasets: [
        {
          data: [won, lost],
          backgroundColor: [
            'var(--money-green)',
            'var(--neon-pink)',
          ],
          borderColor: [
            'var(--money-green)',
            'var(--neon-pink)',
          ],
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
        position: 'bottom' as const,
        labels: {
          color: '#ffffff',
          font: {
            family: "'BlinkMacSystemFont', 'Segoe UI', 'Roboto', sans-serif",
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'var(--cyber-darker)',
        titleColor: 'var(--neon-blue)',
        bodyColor: '#ffffff',
        borderColor: 'var(--neon-blue)',
        borderWidth: 1,
        padding: 12,
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.raw / total) * 100).toFixed(1);
            return `${context.label}: ${context.raw} (${percentage}%)`;
          },
        },
      },
    },
    cutout: '70%',
  };

  const centerText = {
    id: 'centerText',
    afterDatasetsDraw(chart: any) {
      const { ctx, data } = chart;
      const total = data.datasets[0].data.reduce((a: number, b: number) => a + b, 0);
      const won = data.datasets[0].data[0];
      const winRate = total > 0 ? ((won / total) * 100).toFixed(1) : '0.0';

      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 24px BlinkMacSystemFont';
      ctx.fillStyle = 'var(--neon-blue)';
      ctx.fillText(`${winRate}%`, chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y);
      ctx.font = '14px BlinkMacSystemFont';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Win Rate', chart.getDatasetMeta(0).data[0].x, chart.getDatasetMeta(0).data[0].y + 25);
      ctx.restore();
    },
  };

  return (
    <div>
      <h3 className="text-lg font-bold tracking-wider text-neon-blue neon-text mb-4">
        WIN/LOSS RATIO
      </h3>
      <div className="h-[300px] flex items-center justify-center">
        <Doughnut data={chartData} options={options} plugins={[centerText]} />
      </div>
    </div>
  );
};

export default WinLossChart; 