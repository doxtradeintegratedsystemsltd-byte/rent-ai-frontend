import React from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Logo from "@/components/ui/logo";

const ForgotPasswordPage = () => {
  return (
    <main className="bg-foreground flex min-h-screen flex-col items-center justify-center md:flex-row">
      <Logo className="absolute top-20 left-[50%] md:top-10" />
      <div className="flex h-full items-center justify-center">
        <ForgotPasswordForm />
      </div>
      <footer className="absolute bottom-0 pb-4">
        <p className="text-background">©2025</p>
      </footer>
    </main>
  );
};

export default ForgotPasswordPage;
