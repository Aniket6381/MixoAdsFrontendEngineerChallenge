"use client"

import { useEffect, useState } from "react";
import axios from "axios";
import useRealtimeCampaignMetrics from "@/components/useRealtimeCampaignMetrics";
import { useParams } from "next/navigation";
import CampaignLineChart from "@/components/charts/CampaignLineChart";

const CampaignDetail = () => {
    const [campaign, setCampaign] = useState(null)
    const params = useParams()

    const { metrics, status } = useRealtimeCampaignMetrics(params.id);

    console.log("params.id", params.id)

    useEffect(() => {
        axios.get(`https://mixo-fe-backend-task.vercel.app/campaigns/${params.id}`).then((response) => {
            setCampaign(response.data.campaign)
        }).catch((error) => {
            console.log("error fetching Campaign", error)
        })
    }, [params.id])

    return (
        <div className="p-6 space-y-6">
            {campaign && (
                <div className="bg-white text-[#333] p-4 rounded shadow">
                    <h1 className="text-xl font-bold">{campaign.name}</h1>
                    <p className={campaign.status === "active" ? "text-green-500 capitalize" : "text-red-500 capitalize"}>{campaign.status}</p>
                </div>
            )}

            <div className="bg-white p-4 rounded shadow">
                <h2 className="font-semibold mb-2 text-[#333]">Live Performance</h2>
                <span
                    className={`text-sm ${status === "connected"
                        ? "text-green-600"
                        : status === "connecting"
                            ? "text-yellow-500 animate-pulse"
                            : "text-red-500"
                        }`}
                >
                    ● {status}
                </span>
                <CampaignLineChart metrics={metrics} />
            </div>
        </div >
    )
}

export default CampaignDetail