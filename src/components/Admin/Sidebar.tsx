'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Layers, 
  FileText, 
  ExternalLink,
  Settings,
  LogOut,
  Flame
} from 'lucide-react';

const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: ShoppingBag, category: 'Inventory' },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Platforms', href: '/admin/platforms', icon: ExternalLink },
  { name: 'Trending & Deals', href: '/admin/deals', icon: Flame, category: 'Marketing' },
  { name: 'Blog Posts', href: '/admin/blogs', icon: FileText, category: 'Content' },
];


export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col fixed inset-y-0 shadow-sm z-50">
      <div className="p-8 border-b border-slate-50">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
            <Settings size={20} strokeWidth={3} />
          </div>
          <div>
            <span className="font-black tracking-tighter text-lg block text-slate-900 leading-none uppercase">Admin</span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Console</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-6 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => {
          const isActive = item.href === '/admin' 
            ? (pathname === '/admin' || pathname === '/admin/')
            : pathname.startsWith(item.href);
          const showCategory = item.category && (index === 0 || menuItems[index - 1].category !== item.category);

          return (
            <div key={item.href}>
              {item.category && (
                <div className="pt-6 pb-2 px-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
                  {item.category}
                </div>
              )}
              <Link
                href={item.href}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all font-bold group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'
                }`}
              >
                <item.icon size={20} className={`${isActive ? '' : 'group-hover:scale-110'} transition-transform`} />
                <span>{item.name}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-50 space-y-2">
        <Link href="/" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-all text-slate-400 hover:text-slate-900 font-bold group">
          <ExternalLink size={18} />
          <span className="text-sm">Main Website</span>
        </Link>
        <button className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-50 transition-all text-slate-400 hover:text-red-600 font-bold group">
          <LogOut size={18} />
          <span className="text-sm">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
