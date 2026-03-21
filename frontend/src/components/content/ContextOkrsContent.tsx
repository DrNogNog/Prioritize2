// components/content/ContextOkrsContent.tsx
"use client";

import { useState } from "react";

type OKR = {
  id: string;
  label: string;
  children?: OKR[];
};

export default function ContextOkrsContent() {
  const [periodType, setPeriodType] = useState("Quarter");
  const [label, setLabel] = useState("Q2 2026");
  const [startDate, setStartDate] = useState("Apr 1, 2026");
  const [endDate, setEndDate] = useState("Jun 30, 2026");
  const [isActive, setIsActive] = useState(true);

  const [mission, setMission] = useState(
    "Help product teams ship validated features faster."
  );

  const [focusAreas, setFocusAreas] = useState<string[]>([
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
      label: "O1 Grow enterprise ARR by 40%",
      children: [
        {
          id: "o2",
          label: "O2 Improve power user retention",
          children: [
            {
              id: "o3",
              label: "O3 Ship bulk action features in Q2",
            },
          ],
        },
      ],
    },
  ]);

  const addOKR = (parentId?: string) => {
    const title = prompt("Enter new Objective / Key Result title:");
    if (!title?.trim()) return;

    const newOKR: OKR = {
      id: `okr-${Date.now()}`,
      label: title.trim(),
      children: [],
    };

    if (!parentId) {
      // add top-level objective
      setOkrs((prev) => [...prev, newOKR]);
      return;
    }

    // add as child
    const updateChildren = (items: OKR[]): OKR[] =>
      items.map((item) => {
        if (item.id === parentId) {
          return {
            ...item,
            children: [...(item.children || []), newOKR],
          };
        }
        if (item.children) {
          return { ...item, children: updateChildren(item.children) };
        }
        return item;
      });

    setOkrs((prev) => updateChildren(prev));
  };

  const renderOKR = (okr: OKR, level = 0) => (
    <div key={okr.id} className={`ml-${level * 6}`}>
      <div className="group flex items-center gap-3 rounded-lg border border-gray-200 bg-white p-3.5 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
        <div className="min-w-[32px] font-mono text-sm font-semibold text-indigo-600">
          {okr.label.split(" ")[0]}
        </div>
        <input
          type="text"
          value={okr.label}
          onChange={() => {}} // todo: implement edit
          className="flex-1 bg-transparent outline-none text-gray-900"
          readOnly
        />
        <button
          onClick={() => addOKR(okr.id)}
          className="invisible group-hover:visible text-xs text-indigo-600 hover:text-indigo-800"
        >
          + Add child
        </button>
      </div>

      {okr.children?.map((child) => renderOKR(child, level + 1))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/40 px-6 py-8">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header + Controls */}
        <div className="flex flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">
              Context & OKRs
            </h1>
            <div className="flex gap-3">
              <button className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Fetch from Jira
              </button>
              <button className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700">
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Period type</label>
              <select
                value={periodType}
                onChange={(e) => setPeriodType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm"
              >
                <option>Quarter</option>
                <option>Half-year</option>
                <option>Year</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Label</label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Date range</label>
              <div className="mt-1 flex gap-2">
                <input
                  type="text"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm"
                  placeholder="Start"
                />
                <span className="flex items-center text-gray-400">–</span>
                <input
                  type="text"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="block w-full rounded-md border-gray-300 px-3 py-2 text-sm"
                  placeholder="End"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-gray-700">Status:</span>
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}>
              {isActive ? "Active period" : "Inactive"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* Left: Context details */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Context details</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mission</label>
                <textarea
                  value={mission}
                  onChange={(e) => setMission(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quarterly focus areas
                </label>
                <ul className="mt-2 space-y-2">
                  {focusAreas.map((area, i) => (
                    <li key={i} className="text-sm text-gray-800">
                      {area}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Known constraints
                </label>
                <textarea
                  value={constraints}
                  onChange={(e) => setConstraints(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>
          </div>

          {/* Right: OKR hierarchy */}
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">OKR hierarchy</h2>
              <button
                onClick={() => addOKR()}
                className="rounded bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-100"
              >
                + Add O1
              </button>
            </div>

            <div className="space-y-3">
              {okrs.map((okr) => renderOKR(okr))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}