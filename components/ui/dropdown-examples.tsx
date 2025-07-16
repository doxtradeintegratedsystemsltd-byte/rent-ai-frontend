import { Dropdown } from "@/components/ui/dropdown";
import { Icon } from "@/components/ui/icon";

// Example usage of the Dropdown component

export const DropdownExamples = () => {
  // Basic dropdown with simple items
  const basicItems = [
    { label: "Profile", value: "profile", icon: "material-symbols:person" },
    { label: "Settings", value: "settings", icon: "material-symbols:settings" },
    { label: "Help", value: "help", icon: "material-symbols:help" },
  ];

  // Advanced dropdown with separators and labels
  const advancedItems = [
    { type: "label" as const, label: "Account" },
    { label: "Profile", value: "profile", icon: "material-symbols:person" },
    {
      label: "Billing",
      value: "billing",
      icon: "material-symbols:credit-card",
    },
    { type: "separator" as const },
    { type: "label" as const, label: "Team" },
    { label: "Members", value: "members", icon: "material-symbols:group" },
    {
      label: "Settings",
      value: "team-settings",
      icon: "material-symbols:settings",
    },
    { type: "separator" as const },
    {
      label: "Logout",
      value: "logout",
      icon: "material-symbols:logout",
      className: "text-red-600 focus:text-red-600",
    },
  ];

  // Status dropdown with different states
  const statusItems = [
    { label: "Active", value: "active", icon: "material-symbols:check-circle" },
    { label: "Inactive", value: "inactive", icon: "material-symbols:cancel" },
    { label: "Pending", value: "pending", icon: "material-symbols:schedule" },
    {
      label: "Archived",
      value: "archived",
      icon: "material-symbols:archive",
      disabled: true,
    },
  ];

  const handleItemSelect = (value: string) => {
    console.log("Selected:", value);
  };

  return (
    <div className="flex flex-col gap-8 p-8">
      <h2 className="text-2xl font-bold">Reusable Dropdown Examples</h2>

      <div className="flex flex-wrap gap-4">
        {/* Basic dropdown */}
        <Dropdown
          trigger={{
            label: "User Menu",
            icon: "material-symbols:person",
            arrowIcon: "material-symbols:keyboard-arrow-down",
          }}
          items={basicItems}
          onItemSelect={handleItemSelect}
        />

        {/* Filter dropdown */}
        <Dropdown
          trigger={{
            label: "Filter",
            icon: "material-symbols:filter-list",
            arrowIcon: "material-symbols:expand-more",
          }}
          items={[
            { label: "All", value: "all" },
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
          ]}
          onItemSelect={handleItemSelect}
        />

        {/* Status dropdown */}
        <Dropdown
          trigger={{
            label: "Status",
            icon: "material-symbols:radio-button-checked",
            arrowIcon: "material-symbols:unfold-more",
          }}
          items={statusItems}
          onItemSelect={handleItemSelect}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        {/* Advanced dropdown with separators and labels */}
        <Dropdown
          trigger={{
            label: "Advanced Menu",
            icon: "material-symbols:more-vert",
            arrowIcon: "material-symbols:keyboard-arrow-down",
          }}
          items={advancedItems}
          onItemSelect={handleItemSelect}
        />

        {/* Custom trigger content */}
        <Dropdown
          trigger={{
            label: "", // Empty label since we're using custom content
            customContent: (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                  <Icon icon="material-symbols:person" className="text-white" />
                </div>
                <span>John Doe</span>
                <Icon icon="material-symbols:keyboard-arrow-down" />
              </div>
            ),
          }}
          items={basicItems}
          onItemSelect={handleItemSelect}
          align="end"
        />
      </div>
    </div>
  );
};

// Usage in your components:
//
// 1. Basic usage:
// <Dropdown
//   trigger={{
//     label: "Options",
//     icon: "material-symbols:settings",
//     arrowIcon: "material-symbols:keyboard-arrow-down",
//   }}
//   items={[
//     { label: "Edit", value: "edit", icon: "material-symbols:edit" },
//     { label: "Delete", value: "delete", icon: "material-symbols:delete" },
//   ]}
//   onItemSelect={(value) => console.log(value)}
// />
//
// 2. Advanced usage with separators:
// <Dropdown
//   trigger={{ label: "Menu" }}
//   items={[
//     { type: "label", label: "Actions" },
//     { label: "Edit", value: "edit" },
//     { type: "separator" },
//     { label: "Delete", value: "delete", className: "text-red-600" },
//   ]}
// />
//
// 3. Custom trigger:
// <Dropdown
//   trigger={{
//     label: "",
//     customContent: <YourCustomTriggerComponent />
//   }}
//   items={items}
// />
