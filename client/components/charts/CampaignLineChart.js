"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

// REQUIRED REGISTRATION
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

export default function CampaignLineChart({ metrics }) {
    if (!metrics || metrics.length === 0) {
        return <p className="text-gray-500">No chart data available</p>;
    }

    const data = {
        labels: metrics.map(m => m.time),
        datasets: [
            {
                label: "Conversions",
                data: metrics.map(m => m.conversions),
                backgroundColor: '#00f',
                borderWidth: 2,
                tension: 0.4,
            },
            {
                label: "Spend",
                data: metrics.map(m => m.spend),
                backgroundColor: '#0f0',
                borderWidth: 2,
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div style={{ height: "320px" }}>
            <Line data={data} options={options} />
        </div>
    );
}
