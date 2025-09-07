import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function loading() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <LoadingSpinner fullScreen />
    </div>
  );
}
