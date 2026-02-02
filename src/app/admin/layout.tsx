import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#1a1a1a]">
      <AdminSidebar />
      <main className="flex-1 p-6 md:ml-64">
        {children}
      </main>
    </div>
  );
}
