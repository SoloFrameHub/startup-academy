import React from 'react';
import { chartAreaGradient } from '../../charts/ChartjsConfig';
import LineChart from '../../charts/LineChart07';

// Import utilities
import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

function FintechCard08() {

  const chartData = {
    labels: ['2010', 'Age 65'],
    datasets: [
      // Dark green line
      {
        label: 'Growth 1',
        data: [0, 3500000],
        borderColor: getCssVariable('--color-green-500'),
        fill: true,
        backgroundColor: function(context) {
          const chart = context.chart;
          const {ctx, chartArea} = chart;
          return chartAreaGradient(ctx, chartArea, [
            { stop: 0, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0) },
            { stop: 1, color: adjustColorOpacity(getCssVariable('--color-green-500'), 0.2) }
          ]);
        },      
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-green-500'),
        pointHoverBackgroundColor: getCssVariable('--color-green-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
      // Light green line
      {
        label: 'Growth 2',
        data: [0, 2000000],
        borderColor: getCssVariable('--color-green-200'),
        fill: false,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: getCssVariable('--color-green-200'),
        pointHoverBackgroundColor: getCssVariable('--color-green-500'),
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
        tension: 0.2,
      },
    ],
  };

  return (
    <div className="flex flex-col col-span-full sm:col-span-12 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <header className="px-5 py-4 border-b border-gray-100 dark:border-gray-700/60 flex items-center">
        <h2 className="font-semibold text-gray-800 dark:text-gray-100">Growth Portfolio</h2>
      </header>
      <div className="px-5 py-3">
        <div className="text-sm italic mb-2">Hey Mark, by age 65 you could have:</div>
        <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">$2M - $3.5M</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">Risk level 8</div>
      </div>
      {/* Chart built with Chart.js 3 */}
      <div className="grow">
        {/* Change the height attribute to adjust the chart height */}
        <LineChart data={chartData} width={389} height={262} />
      </div>
    </div>
  );
}

export default FintechCard08;
