import { DashboardSidebar } from "@/features/dashboard/components/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <DashboardSidebar />

        <main className="flex-1 overflow-auto bg-white">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}