// app/signal/page.tsx  or  components/SignalPage.tsx
"use client";

import { useState } from "react";

type Opportunity = {
  title: string;
  type: "high_okr" | "low_hanging" | "misaligned_high" | "low_match" | string;
  refs: number;
  accounts: number;
  ltv: string;
  okr: number;
  sources: string[];           // e.g. ["Zendesk-14", "Interviews-6", "Pendo-3"]
  color: string;
  colorText: string;             // for the left bar
  compositeScoreHint?: string;
};

const opportunities: Opportunity[] = [
  {
    title: "Bulk task reassignment during sprint planning",
    type: "high_okr",
    refs: 23,
    accounts: 8,
    ltv: "$450K",
    okr: 94,
    sources: ["Zendesk-14", "Interviews-6", "Pendo-3"],
    color: "#f97316", // orange
    colorText: "#FFF0E0",
    compositeScoreHint: "High OKR match",
  },
  {
    title: "CSV export for sprint reports",
    type: "low_hanging",
    refs: 14,
    accounts: 12,
    ltv: "$280K",
    okr: 72,
    sources: ["Zendesk-9", "Slack-5"],
    color: "#10b981", // green
    colorText: "#EAF3DE",
    compositeScoreHint: "Low hanging fruit",
  },
  {
    title: "Mobile offline mode for field teams",
    type: "misaligned_high",
    refs: 19,
    accounts: 5,
    ltv: "$620K",
    okr: 18,
    sources: ["Intercom-11", "Gong-8"],
    color: "#8b5cf6", // purple
    colorText: "#EEEDFE",
    compositeScoreHint: "Misaligned – high value",
  },
  {
    title: "Dark mode UI preference",
    type: "low_match",
    refs: 9,
    accounts: 14,
    ltv: "$90K",
    okr: 12,
    sources: ["Zendesk-9"],
    color: "#6b7280", // gray
    colorText: "#F5F4F0",
    compositeScoreHint: "Low match",
  },
];

export default function SignalContent() {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="min-h-screen bg-gray-50/40 px-6 py-8 font-sans">
      {/* Header / Controls */}
      <div className="mb-2 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-row gap-4">
            <div className="flex flex-col">
            <div className="bg-[#F5F4F0] border p-4 rounded-md flex flex-col items-center justify-center">
                <div>Sources Active</div>
                <div className="font-bold text-2xl">4</div>
            </div>
            </div>
            <div>
                <div className="flex flex-col">
                <div className="bg-[#F5F4F0] border p-4 rounded-md flex flex-col items-center justify-center border-l-[#BB781C]">Missing connections
                    <div className="text-[#854F0B] font-bold "><span className="text-2xl">2</span> <span className="underline">Fix</span></div>

                </div>
                </div>
            </div>
        
        </div>

        <div className="flex items-center gap-2">
          <span>Signal window</span> 
          <select className="rounded border border-gray-300 bg-[#F5F4F0] px-3 py-1.5 text-sm">
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>Custom range</option>
          </select>

          <button className="rounded bg-[#E6F1FB] px-4 py-1.5 text-sm border border-[#1B60B8] font-medium text-[#1B60B8]
                   transform transition duration-150 active:scale-95 hover:scale-105 hover:shadow-lg cursor-pointer">
            Extract pain points
            </button>
        </div>
      </div>

      {/* Legend */}
      <div className="mb-2 flex flex-wrap flex-row items-center gap-4 text-sm bg-[#F5F4F0] border border-transparent p-2 rounded-md">
        <div className="text-[#5F5E5A]">Legend:</div>
        <div className="border-4 border-l-[#E8761A] border-transparent p-1 bg-white">High OKR match</div>
        <div className="border-4 border-l-[#DEAD1A] border-transparent p-1 bg-white">Partial match</div>
        <div className="border-4 border-l-[#888780] border-transparent p-1 bg-white">Misaligned · high value</div>
        <div className="border-4 border-l-[#7F77DD] border-transparent p-1 bg-white">Low hanging fruit</div>
        <div className="border-4 border-l-[#639922] border-transparent p-1 bg-white">Low match</div>
      </div>
      <div className="mb-2 flex flex-row items-center justify-between  text-sm text-gray-500">
        <div className="text-black">12 opportunities found</div>
        <div>Sorted by composite score · Last run 10 min ago</div>
      </div>



      {/* Cards */}
      <div className="space-y-4">
        {opportunities.map((opp) => {
    
          return (
            <div className="group relative flex overflow-hidden rounded-xl border">
              {/* Left colored indicator bar */}
              <div
                className="w-1.5 flex-shrink-0"
                style={{ backgroundColor: opp.color }}
              />

              <div className="flex-1 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-row gap-4">
                    <h3 className="font-medium text-gray-900">
                      {opp.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500" style={{ border: `1px solid ${opp.colorText}`, backgroundColor: `${opp.colorText}` }}>
                      {opp.compositeScoreHint}
                    </p>
                  </div>

                  <button className="rounded border cursor-pointer border-blue-500 bg-[#E6F1FB] px-3 py-1.5 text-sm font-medium text-blue-500">
                    → PRD
                  </button>
                </div>

                {/* Stats row */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                {/* Optional: thin progress bar — uncomment if the screenshot shows it */}
                {opp.type === "high_okr" && (
                    <div className="flex items-center gap-1.5">
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-gray-200/70">
                        <div
                        className="h-full bg-orange-500 transition-all duration-300"
                        style={{ width: `${opp.okr}%` }}
                        />
                    </div>
                    <span className="text-xs font-medium text-orange-700">{opp.okr}%</span>
                    </div>
                )}

                {/* Main metadata line — order adjusted to match screenshot */}
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                    <div>
                    <span className="font-medium">{opp.refs}</span>
                    <span className="text-gray-500"> refs</span>
                    </div>
                    <div>
                    <span className="font-medium">{opp.accounts}</span>
                    <span className="text-gray-500"> Accounts</span>
                    </div>
                    <div>
                    <span className="text-gray-500">LTV: </span>
                    <span className="font-medium text-emerald-700">{opp.ltv}</span>
                    </div>
                    <div>
                    <span className="text-gray-500">OKR match: </span>
                    <span className="font-medium text-orange-600">{opp.okr}%</span> {/* optional: orange for emphasis */}
                    </div>
                </div>

                {/* Sources tags — make them look like small rounded badges */}
                <div className="flex flex-wrap gap-2 mt-1">
                    {opp.sources.map((src) => (
                    <span
                        key={src}
                        className="inline-flex items-center rounded border border-[#D7D6D3] bg-[#F5F4F0] px-2.5 py-1 text-xs font-medium text-gray-700"
                    >
                        {src}
                    </span>
                    ))}
                </div>
                </div>

                

                
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}