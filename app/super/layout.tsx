import { SuperAdminGuard } from "@/components/auth/auth-guard";
import { Header } from "@/components/header/header";
import { Sidebar } from "@/components/sidebar/sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SuperAdminGuard>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto px-6 py-4">{children}</main>
        </div>
      </div>
    </SuperAdminGuard>
  );
}
