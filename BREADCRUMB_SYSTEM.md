# Custom Breadcrumb System

This custom breadcrumb system allows you to set meaningful breadcrumbs on any page instead of relying on auto-generated breadcrumbs from URLs that may contain IDs or other non-user-friendly segments.

## How it works

The system uses React Context to manage breadcrumb state across the application. Pages can set their own breadcrumbs using the `useBreadcrumb` hook, and the header component displays these custom breadcrumbs.

## Usage

### 1. Import the hook in your page component

```tsx
import { useBreadcrumb, createBreadcrumbs } from "@/hooks/useBreadcrumb";
```

### 2. Set breadcrumbs in your component

```tsx
const MyPage = () => {
  // Set custom breadcrumbs
  useBreadcrumb({
    items: createBreadcrumbs([
      { name: "Properties", href: "/dashboard" },
      { name: "Property Name", href: "/dashboard/property/123" },
      { name: "Current Page", href: "#" },
    ])
  });

  return (
    // Your page content
  );
};
```

### 3. Examples

#### Property Detail Page

```tsx
useBreadcrumb({
  items: createBreadcrumbs([
    { name: "Properties", href: "/dashboard" },
    { name: "Axel Home", href: "#" }, // Get property name from your data
  ]),
});
```

#### Property Notification Page

```tsx
useBreadcrumb({
  items: createBreadcrumbs([
    { name: "Properties", href: "/dashboard" },
    { name: "Axel Home", href: "/dashboard/property/1" },
    { name: "Send Notification", href: "#" },
  ]),
});
```

#### Due Rents Page

```tsx
useBreadcrumb({
  items: createBreadcrumbs([{ name: "Due Rents", href: "#" }]),
});
```

## Key Features

- **Automatic Dashboard Link**: The `createBreadcrumbs` helper automatically adds "Dashboard" as the first breadcrumb if not already present
- **Automatic Last Item Marking**: The last item in the breadcrumb trail is automatically marked as `isLast: true` for styling purposes
- **Fallback Support**: If no custom breadcrumbs are set, the system falls back to auto-generating breadcrumbs from the URL
- **Dynamic Content**: You can use data from your API calls, route parameters, or component state to create meaningful breadcrumb names

## Advanced Usage

### Without the createBreadcrumbs helper

If you want full control and don't want the automatic Dashboard link:

```tsx
useBreadcrumb({
  items: [
    { name: "Custom Start", href: "/custom" },
    { name: "Current Page", href: "#" },
  ],
});
```

### With dynamic data

```tsx
const PropertyPage = ({ params }: { params: { id: string } }) => {
  const [property, setProperty] = useState(null);

  // Fetch property data...
  useEffect(() => {
    fetchProperty(params.id).then(setProperty);
  }, [params.id]);

  // Set breadcrumbs with dynamic property name
  useBreadcrumb({
    items: createBreadcrumbs([
      { name: "Properties", href: "/dashboard" },
      { name: property?.name || "Loading...", href: "#" },
    ])
  });

  return (
    // Your component
  );
};
```

## Notes

- The breadcrumb context is only available within the dashboard layout
- Use `href: "#"` for the current page (last breadcrumb item)
- The system preserves the original fallback behavior for pages that don't set custom breadcrumbs
- Breadcrumbs are automatically reset when navigating between pages that use the hook
