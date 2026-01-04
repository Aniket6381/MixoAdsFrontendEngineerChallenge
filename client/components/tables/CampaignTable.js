"use client"

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import handleApiError from "@/lib/handleApiError";
import toast from "react-hot-toast";

export default function CampaignTable() {
    const [loading, setLoading] = useState(false)
    const [campaigns, setCampaigns] = useState([])
    const router = useRouter();

    useEffect(() => {
        loadTable()
        const interval = setInterval(loadTable, 300000); // 5 min
        return () => clearInterval(interval);
    }, [])

    const loadTable = () => {
        setLoading(true)
        axios.get("https://mixo-fe-backend-task.vercel.app/campaigns").then((response) => {
            console.log("response campaigns", response.data.campaigns)
            setCampaigns(response.data.campaigns)
        }).catch((err) => {
            toast.error(err.message);
            handleApiError(err);
        }).finally(() => {
            setLoading(false)
        })
    }

    const downloadCSV = () => {
        if (!campaigns.length) return;

        toast.success("Download Started")

        const headers = Object.keys(campaigns[0]).join(",");
        const rows = campaigns.map((row) => Object.values(row).join(","));
        const csv = [headers, ...rows].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "campaign-report.csv";
        a.click();
    };

    return (
        <div className="bg-white mx-5 p-4 rounded-xl shadow">
            <div className="flex justify-between items-center mb-3">
                <h2 className="font-semibold text-xl text-[#333]">Campaigns <span className="text-sm text-blue-500">(Click on the Campaign to see Live Performance)</span></h2>
                <button
                    type="button"
                    onClick={downloadCSV}
                    className="px-3 py-1 cursor-pointer text-white rounded-sm active:scale-95 text-sm bg-blue-500 hover:bg-blue-700"
                >
                    Download CSV
                </button>
            </div>

            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b text-[#333] font-semibold text-lg text-left">
                        <th>ID</th>
                        <th>Name</th>
                        <th>Budget</th>
                        <th>Daily Budget</th>
                        <th>Platform</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <td colSpan={6} className="text-center text-xl pt-5 text-[#333] animate-pulse">Loading Table...</td> : campaigns.length > 0 ? campaigns.map((c) => (
                        <tr
                            key={c.id}
                            className="border-b cursor-pointer text-[#333] hover:bg-gray-50"
                            onClick={() => router.push(`/campaigns/${c.id}`)}
                        >
                            <td>{c.id}</td>
                            <td>{c.name}</td>
                            <td>${c.budget}</td>
                            <td>${c.daily_budget}</td>
                            <td className="capitalize">{c.platforms[0]}</td>
                            <td>
                                <span className={c.status === "inactive" ? "text-red-600 animate-pulse" : "text-green-600"}>
                                    {c.status === "inactive" ? "Inactive" : "Active"}
                                </span>
                            </td>
                        </tr>
                    )) : ""}
                </tbody>
            </table>
        </div>
    );
}
