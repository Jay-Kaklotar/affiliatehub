import { Sidebar } from '@/components/Admin/Sidebar';
import ToasterProvider from '@/components/Admin/ToasterProvider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <ToasterProvider />
      <Sidebar />
      <main className="flex-1 ml-72">
        <div className="p-12  mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
