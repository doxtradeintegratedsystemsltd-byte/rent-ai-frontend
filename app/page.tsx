import { LoginForm } from "@/components/auth/login-form";
import Logo from "@/components/ui/logo";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center md:min-h-screen md:flex-row">
      <div className="bg-foreground flex h-30 w-full items-center justify-end md:h-screen md:w-1/2 md:justify-center">
        <Image
          src="/images/auth.png"
          alt="Login Side Image"
          width={600}
          height={600}
          className="hidden md:block"
        />
        <Image
          src="/images/auth-mobile.png"
          alt="Login Side Image"
          width={282}
          height={200}
          className="h-[100px] w-[141px] md:hidden"
          quality={100}
          unoptimized
        />
        <Logo className="absolute top-10 left-10" />
      </div>
      <div className="flex w-full items-center px-4 py-8 md:h-full md:w-1/2 md:justify-center md:px-0 md:py-0">
        <LoginForm />
      </div>
    </main>
  );
}
