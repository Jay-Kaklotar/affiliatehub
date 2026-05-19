import prisma from '@/lib/prisma';
import Link from 'next/link';
import {
  Package,
  BarChart3,
  Globe,
  User,
  PenTool,
  Layers,
  TrendingUp,
  Star,
  Edit3,
  Plus,
  Eye,
  ArrowUpRight,
} from 'lucide-react';

export default async function AdminDashboard() {
  // Fetch all counts
  const productCount = await prisma.product.count();
  const categoryCount = await prisma.category.count();
  const platformCount = await prisma.platform.count();
  const blogCount = await prisma.blogPost.count();
  const offerCount = await prisma.offer.count();
  const trendingCount = await prisma.product.count({ where: { isTrending: true } });
  const dealOfWeekCount = await prisma.product.count({ where: { isDealOfTheWeek: true } });

  // Fetch recent products (latest 5)
  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true, offers: true },
  });

  // Fetch out-of-stock offers with product and platform details
  const outOfStockList = await prisma.offer.findMany({
    where: { isAvailable: false },
    include: { product: { include: { category: true } } },
  });

  // Helper to get platform name from offer (assuming platform field stores brand name)
  const getPlatformName = (offer: any) => offer.platform || 'Unknown';

  // Fetch recent blog posts (latest 5)
  const recentPosts = await prisma.blogPost.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
  });


  // Fetch all categories with product count
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  // Fetch all platforms
  const platforms = await prisma.platform.findMany({
    orderBy: { name: 'asc' },
  });

  // Out of stock offers
  const outOfStockCount = await prisma.offer.count({ where: { isAvailable: false } });

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end">
        <div>
          <span className="text-blue-600 font-bold uppercase tracking-[0.2em] text-[10px] mb-1 block">Overview</span>
          <h1 className="text-4xl font-black tracking-tight text-slate-900">Dashboard</h1>
        </div>
        <div className="flex gap-3">
          <Link href="/admin/products/new" className="bg-slate-900 text-white px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-slate-800 transition-all">
            <Plus size={14} /> New Product
          </Link>
          <Link href="/admin/blogs/new" className="bg-white text-slate-700 px-5 py-2.5 rounded-lg font-bold text-xs flex items-center gap-2 hover:bg-slate-50 transition-all border border-slate-200">
            <PenTool size={14} /> Write Article
          </Link>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Products', value: productCount, icon: <Package size={16} />, href: '/admin/products' },
          { label: 'Categories', value: categoryCount, icon: <Layers size={16} />, href: '/admin/categories' },
          { label: 'Platforms', value: platformCount, icon: <Globe size={16} />, href: '/admin/platforms' },
          { label: 'Blog Posts', value: blogCount, icon: <PenTool size={16} />, href: '/admin/blogs' },
          { label: 'Trending', value: trendingCount, icon: <TrendingUp size={16} />, href: '/admin/trending' },
          { label: 'Total Offers', value: offerCount, icon: <Star size={16} />, href: '/admin/products' },
        ].map((stat, i) => (
          <Link key={i} href={stat.href} className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                {stat.icon}
              </div>
              <ArrowUpRight size={12} className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
            <span className="text-2xl font-black text-slate-900 block">{stat.value}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
          </Link>
        ))}
      </div>

      {/* Main Content: Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Recent Products (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Products</h2>
            <Link href="/admin/products" className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">View All</Link>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                <th className="px-5 py-3">Product</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Offers</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentProducts.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-slate-900 line-clamp-1">{prod.name}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap">{prod.category.name}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-slate-700">₹{prod.price.toLocaleString()}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm font-bold text-slate-500">{prod.offers.length}</span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-1">
                      {prod.isTrending && <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">Trending</span>}
                      {prod.isDealOfTheWeek && <span className="text-[9px] font-bold uppercase bg-green-50 text-green-600 px-1.5 py-0.5 rounded">Deal</span>}
                      {!prod.isTrending && !prod.isDealOfTheWeek && <span className="text-[9px] font-bold uppercase text-slate-300">Regular</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/products/${prod.id}/edit`} className="text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit3 size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm font-medium">No products yet.</p>
            </div>
          )}
        </div>
        
        {/* Right: Categories & Platforms */}
        <div className="space-y-6">
          {/* Categories */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Categories</h2>
              <Link href="/admin/categories" className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">Manage</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {categories.map((cat) => (
                <div key={cat.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={cat.icon} alt="" className="w-5 h-5 object-contain" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{cat._count.products} items</span>
                </div>
              ))}
              {categories.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No categories.</p>
                </div>
              )}
            </div>
          </div>

          {/* Platforms */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Platforms</h2>
              <Link href="/admin/platforms" className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">Manage</Link>
            </div>
            <div className="divide-y divide-slate-50">
              {platforms.map((plat) => (
                <div key={plat.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center overflow-hidden">
                      {plat.logo ? (
                        <img src={plat.logo} alt="" className="w-5 h-5 object-contain" />
                      ) : (
                        <Globe size={14} className="text-slate-300" />
                      )}
                    </div>
                    <span className="text-sm font-bold text-slate-800">{plat.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${plat.isVisible ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-400'}`}>
                    {plat.isVisible ? 'Active' : 'Hidden'}
                  </span>
                </div>
              ))}
              {platforms.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-slate-400 text-sm">No platforms.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Out of Stock Products */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Out of Stock Products</h2>
          </div>
          {outOfStockList.length === 0 ? (
            <p className="text-center text-slate-400 text-sm">All products are in stock.</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-50">
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Brand</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {outOfStockList.map((offer) => (
                  <tr key={offer.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-slate-900">{offer.product.name}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded whitespace-nowrap">
                        {getPlatformName(offer)}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/admin/products/${offer.product.id}/edit`} className="text-slate-400 hover:text-blue-600 transition-colors w-max ml-auto block">
                        <Edit3 size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Inventory Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Deal of the Week</span>
                <span className="text-sm font-black text-slate-900">{dealOfWeekCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Trending Products</span>
                <span className="text-sm font-black text-slate-900">{trendingCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Out of Stock Offers</span>
                <span className="text-sm font-black text-red-500">{outOfStockCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Featured Articles</span>
                <span className="text-sm font-black text-slate-900">{recentPosts.filter(p => p.isFeatured).length}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">Quick Links</h3>
            <div className="space-y-2">
              {[
                { label: 'Add Product', href: '/admin/products/new', icon: <Plus size={12} /> },
                { label: 'Add Category', href: '/admin/categories/new', icon: <Plus size={12} /> },
                { label: 'Write Article', href: '/admin/blogs/new', icon: <PenTool size={12} /> },
                { label: 'View Website', href: '/', icon: <Eye size={12} /> },
              ].map((link, i) => (
                <Link key={i} href={link.href} className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 py-1.5 transition-colors hover:bg-slate-50/50 rounded">
                  <span className="w-6 h-6 bg-slate-50 rounded flex items-center justify-center text-slate-400">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Blog Posts & Quick Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent Blog Posts */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Articles</h2>
            <Link href="/admin/blogs" className="text-[10px] font-bold text-blue-600 uppercase tracking-wider hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-slate-50">
            {recentPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{post.title}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">{post.category}</span>
                    <span className="text-[10px] text-slate-400">{post.date}</span>
                    <span className="text-[10px] text-slate-400">by {post.author}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {post.isFeatured && <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">Featured</span>}
                  <Link href={`/admin/blogs/${post.id}/edit`} className="text-slate-400 hover:text-blue-600 transition-colors">
                    <Edit3 size={14} />
                  </Link>
                </div>
              </div>
            ))}
            {recentPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm font-medium">No articles yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
