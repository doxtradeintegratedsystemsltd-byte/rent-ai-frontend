interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  message?: string;
}

export function LoadingSpinner({
  size = "md",
  fullScreen = false,
  message,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8 border-2",
    md: "h-16 w-16 border-t-4",
    lg: "h-24 w-24 border-t-4",
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`border-primary animate-spin rounded-full ${sizeClasses[size]}`}
      ></div>
      {message && <p className="mt-4 text-lg text-gray-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
        {spinner}
      </div>
    );
  }

  return spinner;
}
