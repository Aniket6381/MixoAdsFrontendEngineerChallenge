"use client";

import { useState } from "react";

export default function Filters({ onChange }) {
    const [filters, setFilters] = useState({
        startDate: "",
        endDate: "",
        campaign: "",
        channel: "",
        status: "",
        search: ""
    });

    const updateFilter = (key, value) => {
        const updated = { ...filters, [key]: value };
        setFilters(updated);
        onChange(updated);
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow grid grid-cols-1 md:grid-cols-6 gap-4">

            {/* Date From */}
            <input
                type="date"
                value={filters.startDate}
                onChange={(e) => updateFilter("startDate", e.target.value)}
                className="border p-2 rounded"
            />

            {/* Date To */}
            <input
                type="date"
                value={filters.endDate}
                onChange={(e) => updateFilter("endDate", e.target.value)}
                className="border p-2 rounded"
            />

            {/* Campaign */}
            <input
                type="text"
                placeholder="Campaign name"
                value={filters.campaign}
                onChange={(e) => updateFilter("campaign", e.target.value)}
                className="border p-2 rounded"
            />

            {/* Channel */}
            <select
                value={filters.channel}
                onChange={(e) => updateFilter("channel", e.target.value)}
                className="border p-2 rounded"
            >
                <option value="">All Channels</option>
                <option value="google">Google</option>
                <option value="facebook">Facebook</option>
                <option value="email">Email</option>
            </select>

            {/* Status */}
            <select
                value={filters.status}
                onChange={(e) => updateFilter("status", e.target.value)}
                className="border p-2 rounded"
            >
                <option value="">All Status</option>
                <option value="alert">Alert</option>
                <option value="healthy">Healthy</option>
            </select>

            {/* Search */}
            <input
                type="text"
                placeholder="Search"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                className="border p-2 rounded"
            />
        </div>
    );
}
