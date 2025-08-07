import Link from "next/link";
import Logo from "@/components/ui/logo";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4">
      <div className="max-w-md space-y-6 text-center">
        <div className="flex justify-center">
          <Logo dark />
        </div>

        <div className="space-y-2">
          <h1 className="text-8xl font-bold">404</h1>
          <h2 className="text-2xl font-semibold">Page Not Found!</h2>
        </div>

        <p className="text-muted-foreground text-lg leading-relaxed">
          Oops! The page you&apos;re looking for doesn&apos;t exist. It might
          have been moved, deleted, or you entered the wrong URL.
        </p>

        <Link href="/">
          <Button className="w-full uppercase">Go Home</Button>
        </Link>
      </div>
    </div>
  );
}
