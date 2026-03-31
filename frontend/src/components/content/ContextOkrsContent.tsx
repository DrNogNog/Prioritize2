"use client";

import { useState } from "react";

type OKR = {
  id: string;
  code: string; // O1, O2, O3
  title: string;
  children?: OKR[];
};

export default function ContextOkrsContent() {
  const [periodType, setPeriodType] = useState("Quarter");
  const [label, setLabel] = useState("Q2 2026");
  const [startDate, setStartDate] = useState("Apr 1, 2026");
  const [endDate, setEndDate] = useState("Jun 30, 2026");
  const [isActive] = useState(true);

  const [mission, setMission] = useState(
    "Help product teams ship validated features faster."
  );

  const [focusAreas] = useState<string[]>([
    "1. Improve power user retention",
    "2. Cross-sell Feature D2 to existing accounts",
    "3. Automate Workflow N3 with AI",
  ]);

  const [constraints, setConstraints] = useState(
    "Team capacity: 6 engineers. Platform migration in progress."
  );

  const [okrs, setOkrs] = useState<OKR[]>([
    {
      id: "o1",
      code: "O1",
      title: "Grow enterprise ARR by 40%",
      children: [
        {
          id: "o2",
          code: "O2",
          title: "Improve power user retention",
          children: [
            {
              id: "o3",
              code: "O3",
              title: "Ship bulk action features in Q2",
            },
          ],
        },
      ],
    },
  ]);

  const addOKR = (parentId?: string, level = 1) => {
    const title = prompt("Enter title:");
    if (!title?.trim()) return;

    const newOKR: OKR = {
      id: `okr-${Date.now()}`,
      code: `O${level}`,
      title: title.trim(),
      children: [],
    };

    if (!parentId) {
      setOkrs((prev) => [...prev, newOKR]);
      return;
    }

    const addChild = (items: OKR[]): OKR[] =>
      items.map((item) => {
        if (item.id === parentId) {
          const currentLevel = Number(item.code.replace("O", ""));
          const nextLevel = currentLevel + 1;

          return {
            ...item,
            children: [
              ...(item.children || []),
              { ...newOKR, code: `O${nextLevel}` },
            ],
          };
        }
        if (item.children) {
          return { ...item, children: addChild(item.children) };
        }
        return item;
      });

    setOkrs((prev) => addChild(prev));
  };

  const renderOKR = (okr: OKR, level = 0) => {
  const nextLevel = `O${level + 2}`;

  return (
    <div key={okr.id}>
      {/* Row */}
      <div
        className="group flex items-center justify-between rounded border border-[#D7D6D3] bg-white px-3 py-2 text-sm"
        style={{ marginLeft: `${level * 16}px` }}
      >
        <div className="flex items-center gap-2">
          {/* Code badge */}
          <span className="text-xs font-medium text-gray-500">
            {okr.code}
          </span>

          {/* Title */}
          <span className="text-gray-800">{okr.title}</span>
        </div>

        {/* Add child */}
        <button
          onClick={() => addOKR(okr.id, level + 2)}
          className="invisible text-xs text-gray-400 hover:text-gray-600 group-hover:visible"
        >
          + Add {nextLevel}
        </button>
      </div>

      {/* Children */}
      {okr.children && okr.children.length > 0 && (
        <div className="mt-1 border-l border-[#D7D6D3] pl-3 space-y-1">
          {okr.children.map((child) => renderOKR(child, level + 1))}
        </div>
      )}
    </div>
  );
};

  return (
    <div className="min-h-screen bg-[#EEEDE9] px-4 py-4">
      <div className="space-y-4">
        {/* Header */}
        <div className="rounded-md bg-[#F5F4F0] p-4">
          {/* Top row */}
          <div className="flex items-center justify-between">
            <h1 className="text-base font-medium text-gray-900">
              Context & OKRs
            </h1>

            <div className="flex items-center gap-2">
              <button className="rounded border border-[#D7D6D3] bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50">
                Fetch from Jira
              </button>

              <button className="rounded border border-[#1B60B8] bg-[#E6F1FB] px-3 py-1.5 text-xs font-medium text-[#1B60B8] hover:scale-105 transition">
                Save
              </button>
            </div>
          </div>

          {/* Meta row (matches Signal style) */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
            {/* Period */}
            <span className="rounded border border-[#D7D6D3] bg-white px-2 py-1">
              {periodType}
            </span>

            {/* Label */}
            <span className="rounded border border-[#D7D6D3] bg-white px-2 py-1">
              {label}
            </span>

            {/* Date range */}
            <span className="rounded border border-[#D7D6D3] bg-white px-2 py-1">
              {startDate} – {endDate}
            </span>

            {/* Status */}
            <span
              className={`rounded px-2 py-1 ${
                isActive
                  ? "bg-[#EAF3DE] text-[#4F6F18] border border-[#D7D6D3]"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {isActive ? "Active period" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Main */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left */}
          <div className="rounded-md bg-[#F5F4F0] p-4">
            <h2 className="mb-3 text-sm font-medium text-gray-800">
              Context details
            </h2>

            <div className="space-y-4 text-sm">
              {/* Mission */}
              <div>
                <div className="text-xs text-gray-500 mb-1">Mission</div>
                <div className="rounded border border-[#D7D6D3] bg-white px-3 py-2 text-gray-800">
                  {mission}
                </div>
              </div>

              {/* Focus areas */}
              <div>
                <div className="text-xs text-gray-500 mb-1">
                  Quarterly focus areas
                </div>

                <div className="space-y-1">
                  {focusAreas.map((area, i) => (
                    <div
                      key={i}
                      className="rounded border border-[#D7D6D3] bg-white px-3 py-2 text-gray-800"
                    >
                      {area}
                    </div>
                  ))}
                </div>
              </div>

    {/* Constraints */}
    <div>
      <div className="text-xs text-gray-500 mb-1">
        Known constraints
      </div>
      <div className="rounded border border-[#D7D6D3] bg-white px-3 py-2 text-gray-800">
        {constraints}
      </div>
    </div>
  </div>
</div>

          {/* Right */}
          <div className="rounded-md bg-[#F5F4F0] p-4">
          {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-medium text-gray-800">
                OKR hierarchy
              </h2>

              <button
                onClick={() => addOKR(undefined, 1)}
                className="rounded border border-[#D7D6D3] bg-white px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
              >
                + Add O1
              </button>
            </div>

            {/* Tree */}
            <div className="space-y-2">
              {okrs.map((okr) => renderOKR(okr))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}