import { useState } from "react";
import {
  useGetOrgsQuery,
  useSwitchOrgQuery,
} from "../../Redux/api/organizationsApi";

export default function OrganizationSwitcher() {
  const { data: orgs } = useGetOrgsQuery();
  const [selected, setSelected] = useState<string | null>(null);
  const { data: switchedOrg } = useSwitchOrgQuery(selected!, {
    skip: !selected,
  });

  return (
    <div>
      <select
        className="bg-gray-800 text-white p-2 rounded border border-secondary-800"
        value={selected || ""}
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Select organization...</option>
        {(Array.isArray(orgs) ? orgs : orgs?.managed_orgs || [])?.map((org) => (
          <option key={org.client_name} value={org.client_name}>
            {org.organization_name}
          </option>
        ))}
      </select>
      {switchedOrg && (
        <div className="mt-4 p-4 rounded bg-gray-900 border border-secondary-700">
          <div className="font-bold text-secondary-400">
            {switchedOrg.organization_name}
          </div>
        </div>
      )}
    </div>
  );
}
