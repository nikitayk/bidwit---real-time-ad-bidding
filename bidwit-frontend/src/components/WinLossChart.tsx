import { useEffect, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface WinLossChartProps {
  data: {
    wins: number;
    losses: number;
  };
}

const WinLossChart = ({ data }: WinLossChartProps) => {
  const chartRef = useRef<ChartJS<"doughnut", number[], string>>(null);

  const chartData = {
    labels: ['Won', 'Lost'],
    datasets: [
      {
        data: [data.wins, data.losses],
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)', // Green for wins
          'rgba(239, 68, 68, 0.8)', // Red for losses
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 1,
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#f1f5f9', // text-dark-text-primary
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#f1f5f9',
        bodyColor: '#f1f5f9',
        padding: 12,
        boxPadding: 8,
        callbacks: {
          label: function(context: any) {
            const total = data.wins + data.losses;
            const value = context.raw;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Add center text with win rate
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const totalBids = data.wins + data.losses;
      const winRate = totalBids > 0 ? ((data.wins / totalBids) * 100).toFixed(1) : '0.0';

      const originalDraw = chart.draw;
      chart.draw = function() {
        originalDraw.apply(this);
        
        const ctx = chart.ctx;
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        ctx.save();
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Win rate percentage
        ctx.font = 'bold 24px Inter';
        ctx.fillStyle = '#f1f5f9';
        ctx.fillText(`${winRate}%`, centerX, centerY - 10);
        
        // "Win Rate" label
        ctx.font = '14px Inter';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Win Rate', centerX, centerY + 15);
        
        ctx.restore();
      };
    }
  }, [data]);

  return (
    <div className="relative h-full w-full">
      <Doughnut ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default WinLossChart; 