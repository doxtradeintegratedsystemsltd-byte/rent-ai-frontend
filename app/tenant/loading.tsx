import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function TenantLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Tenant profile skeleton */}
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 animate-pulse rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-6 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-48 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Property info skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-40 animate-pulse rounded bg-gray-200" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
          <div className="h-32 animate-pulse rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Payment section skeleton */}
      <div className="space-y-4">
        <div className="h-8 w-36 animate-pulse rounded bg-gray-200" />
        <div className="h-24 animate-pulse rounded-lg bg-gray-200" />
      </div>
    </div>
  );
}
