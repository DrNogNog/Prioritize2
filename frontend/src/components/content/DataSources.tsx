import { FC } from "react";

const integrations = [
  { name: "Jira", status: "Live", isLive: true, label: "J", color:"#E6F1FB", textcolor:"#185FA8"},
  { name: "Zendesk", status: "Live", isLive: true, label: "Z", color:"#EAF3DE", textcolor:"#3B6D11" },
  { name: "Hotjar", status: "Live", isLive: true, label: "H", color:"#FAEEDA", textcolor:"#854F2C" },
  { name: "Pendo", status: "Expired", isLive: false, label: "P", color:"#F5F4F0", textcolor:"#5F5E5A" },
  { name: "Intercom", status: "Not set", isLive: false, label: "I", color:"#F5F4F0", textcolor:"#B3B3AE" },
];

const DataSources: FC = () => {
  return (
    <div className="bg-[#F5F4F0] border border-gray-200 shadow-sm flex flex-col flex-1">
      {/* Header */}
      <div className="border-b pb-2 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="p-4 mt-4 text-lg font-semibold text-gray-900">Data sources</h3>
        <button className="p-4 mt-4 text-sm font-medium text-blue-600 hover:text-blue-800">
          Manage
        </button>
      </div>
      </div>

      {/* List of sources */}
      <div className="space-y-4 p-4">
        {integrations.map((integration) => {
  const isExpired = integration.status === "Expired";
  const StatusTag = isExpired ? "button" : "span";
  const isNotSet = integration.status === "Not set";

  return (
        <div
          key={integration.name}
          className={`flex items-center justify-between py-2 rounded-md pl-2 pr-2 border
            ${isExpired ? "border-[#AD5F38]" : "border-gray-200"}
            ${isNotSet ? "bg-[#FAFAF8]" : "bg-[#FFFFFF]"}
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden font-bold"
              style={{ backgroundColor: integration.color, color : integration.textcolor }}
            >
              {integration.label}
            </div>

            <span className="font-medium text-gray-900">
              <div style={{color : integration.textcolor}}>{integration.name} </div>
            </span>
          </div>

                {/* Status badge */}
                <div className="flex items-center gap-2">
                  <StatusTag
                    onClick={
                      isExpired ? () => alert(`Renew ${integration.name}`) : undefined
                    }
                    className={`
                      px-3 py-1 text-xs font-medium rounded-md
                      ${isExpired ? "cursor-pointer" : ""}
                      ${
                        integration.status === "Live"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : integration.status === "Expired"
                          ? "bg-[#FAEEDA] text-[#AD5F38] border-none hover:bg-[#f5e3c7]"
                          : "text-gray-300 border border-none"
                      }
                    `}
                  >
                    {integration.status}
                    {isExpired && <span className="ml-1">↗</span>}
                  </StatusTag>
                </div>
        </div>
        );
      })}
      </div>

      {/* Footer note */}
      {/* Footer note for sources "Not set" */}
      {integrations.some((i) => i.status === "Not set") && (
        <div className="mt-2 p-4">
          <div className="border bg-[#FAEEDA] rounded-md justify-center p-2">
              <p className="text-sm text-[#AD5F38]">
                <span className="font-bold">
                {integrations.filter((i) => i.status === "Not set").length} source
                {integrations.filter((i) => i.status === "Not set").length > 1 ? "s" : ""} not contributing
                <br />
                </span>
                <span className="text-[#AD5F38]">
                  {integrations
                    .filter((i) => i.status === "Not set")
                    .map((i) => `${i.name} token not set`)
                    .join(", ")}
                  , results may be incomplete.
                </span>
              </p>
        </div>
        </div>
      )}
    </div>
  );
};

export default DataSources;