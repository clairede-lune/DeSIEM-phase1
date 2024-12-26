import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register all necessary components
Chart.register(...registerables);

const Charts = ({ criticalAlertCount, highAlertCount }) => {
    const chartData = {
        labels: ['Critical Alerts', 'High Alerts'],
        datasets: [
            {
                label: 'Alert Counts',
                data: [criticalAlertCount, highAlertCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)', // Color for Critical Alerts
                    'rgba(54, 162, 235, 0.6)', // Color for High Alerts
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Alert Counts</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default Charts;
