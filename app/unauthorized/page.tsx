import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <Logo dark />
        </div>

        <div className="space-y-2">
          <h1 className="text-8xl font-bold">403</h1>
          <h2 className="text-2xl font-semibold">Access Denied!</h2>
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed">
          You don&apos;t have permission to access this resource.
        </p>

        <Link href="/">
          <Button className="w-full uppercase">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
