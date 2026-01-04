"use client";

import { Suspense, useEffect, useState } from "react";

import KPICards from "@/components/KPICards";
import CampaignTable from "@/components/tables/CampaignTable";

export default function DashboardPage() {

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl ms-5 font-bold">Campaign Performance Dashboard</h1>
      <KPICards />
      <CampaignTable />
    </div>
  );
}
