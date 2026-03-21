// components/content/IntegrationsContent.tsx
"use client";

import { useState } from "react";

type IntegrationStatus = "live" | "expired" | "not_connected" | "connecting";

type Integration = {
  id: string;
  name: string;
  category: "pm" | "metrics" | "support" | "other";
  icon?: string; // letter or shortcode
  status: IntegrationStatus;
  scope?: string; // e.g. "Org-level", "Product"
  note?: string; // e.g. "Expired"
  isOrg?: boolean;
};

const initialIntegrations: Integration[] = [
  {
    id: "jira",
    name: "Jira",
    category: "pm",
    icon: "J",
    status: "live",
    scope: "Org-level",
    isOrg: true,
  },
  {
    id: "linear",
    name: "Linear",
    category: "pm",
    icon: "L",
    status: "not_connected",
  },
  {
    id: "asana",
    name: "Asana",
    category: "pm",
    icon: "A",
    status: "not_connected",
  },
  {
    id: "hotjar",
    name: "Hotjar",
    category: "metrics",
    icon: "H",
    status: "live",
    scope: "Product",
  },
  {
    id: "pendo",
    name: "Pendo",
    category: "metrics",
    icon: "P",
    status: "expired",
    note: "Expired",
  },
  {
    id: "zendesk",
    name: "Zendesk",
    category: "support",
    icon: "Z",
    status: "live",
    scope: "Product",
  },
  {
    id: "intercom",
    name: "Intercom",
    category: "support",
    icon: "I",
    status: "not_connected",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "other",
    icon: "HS",
    status: "not_connected",
  },
];

export default function IntegrationsContent() {
  const [integrations, setIntegrations] = useState(initialIntegrations);

  const getStatusStyles = (status: IntegrationStatus) => {
    switch (status) {
      case "live":
        return {
          dot: "bg-green-500",
          text: "text-green-700",
          bg: "bg-green-100",
          button: "border-red-300 text-red-700 hover:bg-red-50",
          buttonText: "Disconnect",
        };
      case "expired":
        return {
          dot: "bg-amber-500",
          text: "text-amber-700",
          bg: "bg-amber-100",
          button: "border-amber-400 text-amber-800 hover:bg-amber-50",
          buttonText: "Re-connect",
        };
      case "not_connected":
        return {
          dot: "bg-gray-400",
          text: "text-gray-600",
          bg: "bg-gray-100",
          button: "border-indigo-300 text-indigo-700 hover:bg-indigo-50",
          buttonText: "Connect",
        };
      default:
        return {
          dot: "bg-gray-400",
          text: "text-gray-600",
          bg: "bg-gray-100",
          button: "border-gray-300 text-gray-700 hover:bg-gray-50",
          buttonText: "Connect",
        };
    }
  };

  const handleAction = (id: string) => {
    setIntegrations((prev) =>
      prev.map((int) => {
        if (int.id !== id) return int;

        if (int.status === "live") {
          return { ...int, status: "not_connected" };
        }
        if (int.status === "expired" || int.status === "not_connected") {
          return { ...int, status: "live" };
        }
        return int;
      })
    );
  };

  const pmStack = integrations.filter((i) => i.category === "pm");
  const productMetrics = integrations.filter((i) => i.category === "metrics");
  const customerSupport = integrations.filter((i) => i.category === "support");
  const others = integrations.filter((i) => i.category === "other");

  const renderSection = (
    title: string,
    items: Integration[],
    showAddButton = false
  ) => (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((integration) => {
          const styles = getStatusStyles(integration.status);

          return (
            <div
              key={integration.id}
              className="relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg font-semibold text-white ${
                      integration.icon?.length === 1
                        ? "bg-indigo-600"
                        : "bg-gray-700"
                    }`}
                  >
                    {integration.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {integration.name}
                    </h4>
                    {integration.scope && (
                      <div className="mt-0.5 flex items-center gap-1.5 text-xs">
                        <div className={`h-2 w-2 rounded-full ${styles.dot}`} />
                        <span className={`font-medium ${styles.text}`}>
                          {integration.scope}
                        </span>
                        {integration.note && (
                          <span className="text-amber-600">
                            • {integration.note}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {integration.status !== "not_connected" && (
                  <button
                    onClick={() => handleAction(integration.id)}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium ${styles.button}`}
                  >
                    {styles.buttonText}
                  </button>
                )}

                {integration.status === "not_connected" && (
                  <button
                    onClick={() => handleAction(integration.id)}
                    className={`rounded-md border px-4 py-1.5 text-sm font-medium ${styles.button}`}
                  >
                    {styles.buttonText}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {showAddButton && (
          <button className="flex h-full min-h-[108px] items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/50 text-sm font-medium text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition-colors">
            + Add integration
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/40 px-6 py-8">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Integrations
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Connect your tools or import data one-off — both paths work for all
              features
            </p>
          </div>

          <button className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700">
            + One-off import
          </button>
        </div>

        {/* Sections */}
        {renderSection("PM STACK", pmStack)}
        {renderSection("PRODUCT METRICS", productMetrics)}
        {renderSection("CUSTOMER SUPPORT", customerSupport)}
        {renderSection("OTHERS", others, true)}
      </div>
    </div>
  );
}