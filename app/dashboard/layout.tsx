import { Sidebar } from "@/components/sidebar/sidebar";
import { Header } from "@/components/header/header";
import { AdminOrSuperAdminGuard } from "@/components/auth/auth-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminOrSuperAdminGuard>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto px-6 py-4">{children}</main>
        </div>
      </div>
    </AdminOrSuperAdminGuard>
  );
}
