export default function SuperLoading() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Super admin stats skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-lg bg-gray-200" />
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 animate-pulse rounded bg-gray-200"
            />
          ))}
        </div>
        <div className="h-px animate-pulse bg-gray-200" />
      </div>

      {/* Content area skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
        </div>
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-16 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
