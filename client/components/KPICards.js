"use client"

import axios from "axios"
import React, { useEffect, useState } from "react"
import toast from "react-hot-toast"
import handleApiError from "@/lib/handleApiError";

const KPICards = () => {
    const [kpiData, setKPIData] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        loadCards();
        const interval = setInterval(loadCards, 300000); // 5 min
        return () => clearInterval(interval);
    }, []);

    const loadCards = () => {
        setLoading(true)
        axios.get("https://mixo-fe-backend-task.vercel.app/campaigns/insights").then((response) => {
            console.log("response kpis", response.data.insights)
            const Insights = response.data.insights

            const kpis = [
                { label: "Total Spend", value: Insights.total_spend, alert: false },
                { label: "Impressions", value: Insights.total_impressions, alert: false },
                { label: "CTR", value: Insights.avg_ctr, alert: Insights.avg_ctr < 3 ? true : false },
                { label: "Conversions", value: Insights.total_conversions, alert: false },
                { label: "CPA", value: Insights.avg_cpc, alert: false },
            ]
            setKPIData(kpis)

        }).catch((err) => {
            toast.error(err.message);
            handleApiError(err);
        }).finally(() => {
            setLoading(false)
        })
    }

    console.log("kpiData", kpiData)

    return (
        <section className="px-5 grid grid-cols-5 justify-center gap-10">
            {loading ? <div className="text-center text-white text-lg animate-pulse">Loading Cards...</div> : kpiData.length > 0 ? kpiData?.map((item, idx) => {
                return (
                    <div className="bg-white text-black py-2 text-center space-y-3 shadow-xl rounded-xl">
                        <div className="text-xl font-bold">{item.label}</div>
                        <div className={`${item.alert ? "text-red-600 animate-pulse" : ""}`}>{item.value}</div>
                    </div>
                )
            }) : ""}
        </section>
    )
}

export default KPICards