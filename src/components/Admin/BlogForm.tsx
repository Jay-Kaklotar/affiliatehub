'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Save, Loader2, ImageIcon, Type, FileText, ArrowLeft, Upload, Eye, Edit3, X, List, ListOrdered } from 'lucide-react';
import toast from 'react-hot-toast';
import { createBlogPost, updateBlogPost } from '@/actions/blogActions';
import { uploadImage } from '@/actions/uploadActions';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRef } from 'react';

interface BlogFormProps {
  initialData?: any;
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(false);
  const [timestamp, setTimestamp] = useState(0);
  
  // Set timestamp only on client side to avoid hydration mismatch
  useState(() => {
    if (typeof window !== 'undefined') setTimestamp(Date.now());
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    category: initialData?.category || '',
    author: initialData?.author || '',
    image: initialData?.image || '',
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setFormData({ ...formData, title, slug });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isFeatured: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append('file', file);

    const res = await uploadImage(data);
    
    if (res.success && res.url) {
      if (isFeatured) {
        setFormData({ ...formData, image: res.url });
        toast.success('Featured image uploaded!');
      } else {
        const imageMarkdown = `\n![${file.name}](${res.url})\n`;
        setFormData({ ...formData, content: formData.content + imageMarkdown });
        toast.success('Image added to content!');
      }
    } else {
      toast.error(res.error || 'Upload failed');
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
    });

    const res = initialData 
        ? await updateBlogPost(initialData.id, data)
        : await createBlogPost(data);

    if (res.success) {
      toast.success(initialData ? 'Article updated!' : 'Article published!');
      if (initialData) {
        router.refresh();
        setLoading(false);
      } else {
        window.location.href = '/admin/blogs';
      }
    } else {
      toast.error(res.error || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-24">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <FileText className="text-blue-600" size={20} />
                    <h2 className="text-xl font-bold text-slate-900">Article Content</h2>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Article Title</label>
                        <input 
                            required
                            type="text" 
                            value={formData.title}
                            onChange={handleTitleChange}
                            placeholder="e.g. 10 Best Productivity Tools for 2024"
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl font-bold text-xl text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Short Excerpt (SEO Summary)</label>
                        <textarea 
                            required
                            rows={3}
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            placeholder="A brief summary of the article for search results..."
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-600 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                        />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                Full Content
                            </label>
                            <div className="flex gap-2">
                                <button 
                                    type="button"
                                    onClick={() => setPreview(!preview)}
                                    className={`flex items-center gap-1.5 px-3 py-1 rounded text-[10px] font-bold transition-all ${preview ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    {preview ? <><Edit3 size={12} /> Edit Mode</> : <><Eye size={12} /> Preview Mode</>}
                                </button>
                                <div className="w-px h-4 bg-slate-200 mx-1 self-center" />
                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, content: formData.content + "\n# " })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                >
                                    H1
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, content: formData.content + "\n## " })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                >
                                    H2
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, content: formData.content + " **Bold Text** " })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                >
                                    Bold
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, content: formData.content + "\n- " })}
                                    title="Bullet List"
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors flex items-center justify-center"
                                >
                                    <List size={14} />
                                </button>
                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, content: formData.content + "\n1. " })}
                                    title="Numbered List"
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors flex items-center justify-center"
                                >
                                    <ListOrdered size={14} />
                                </button>
                                
                                <input 
                                    type="file"
                                    ref={contentImageInputRef}
                                    onChange={(e) => handleFileUpload(e, false)}
                                    className="hidden"
                                    accept="image/*"
                                />
                                <button 
                                    type="button"
                                    onClick={() => contentImageInputRef.current?.click()}
                                    disabled={uploading}
                                    className="px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-[10px] font-bold text-blue-600 transition-colors border border-blue-100 disabled:opacity-50 flex items-center gap-1"
                                >
                                    {uploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
                                    Upload Image
                                </button>

                                <button 
                                    type="button"
                                    onClick={() => setFormData({ ...formData, content: formData.content + " [Link Text](URL_HERE) " })}
                                    className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-[10px] font-bold text-slate-600 transition-colors"
                                >
                                    Link
                                </button>
                            </div>
                        </div>
                        
                        {preview ? (
                            <div className="w-full min-h-[460px] p-8 bg-slate-50 border border-slate-200 rounded-xl prose prose-slate max-w-none overflow-y-auto blog-content-preview">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {formData.content || "*No content to preview*"}
                                </ReactMarkdown>
                            </div>
                        ) : (
                            <textarea 
                                required
                                rows={18}
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                placeholder="Start writing your article here..."
                                className="w-full p-4 bg-white border border-slate-200 rounded-xl font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all leading-relaxed"
                            />
                        )}
                        
                        <p className="mt-2 text-[10px] text-slate-400 italic">
                            Tip: You can use Markdown for styling. Use the Preview button to see how it looks.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <Type size={18} className="text-slate-400" />
                    <h2 className="text-lg font-bold text-slate-900">Metadata</h2>
                </div>
                
                <div className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">URL Slug</label>
                        <input 
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-slate-900 focus:border-blue-500 outline-none transition-all" 
                            placeholder="url-slug-here" 
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Category</label>
                        <input 
                            required
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-slate-900 focus:border-blue-500 outline-none transition-all" 
                            placeholder="Tech / Lifestyle" 
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Author</label>
                        <input 
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-slate-900 focus:border-blue-500 outline-none transition-all" 
                            placeholder="Your Name" 
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                    <ImageIcon size={18} className="text-slate-400" />
                    <h2 className="text-lg font-bold text-slate-900">Featured Image</h2>
                </div>
                
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input 
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-lg font-bold text-sm text-slate-900 focus:border-blue-500 outline-none transition-all" 
                            placeholder="https://images.unsplash.com/..." 
                        />
                        <input 
                            type="file"
                            ref={fileInputRef}
                            onChange={(e) => handleFileUpload(e, true)}
                            className="hidden"
                            accept="image/*"
                        />
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs uppercase transition-all hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
                        >
                            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                            Upload
                        </button>
                    </div>
                    {formData.image && (
                        <div className="relative w-full aspect-video rounded-xl border border-slate-200 overflow-hidden bg-slate-50 group">
                            <Image 
                                src={timestamp ? `${formData.image.trim()}?v=${timestamp}` : formData.image.trim()} 
                                alt="Preview" 
                                fill
                                unoptimized
                                className="w-full h-full object-cover" 
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/placeholder-blog.jpg';
                                }}
                            />
                            <button 
                                type="button"
                                onClick={() => setFormData({ ...formData, image: '' })}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    )}
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">Upload your own image or paste a URL. Recommended size: 1200x630px.</p>
                </div>
            </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 z-40">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex justify-between items-center">
            <button 
                type="button"
                onClick={() => window.history.back()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
            >
                <ArrowLeft size={18} />
                <span>Back</span>
            </button>

            <button 
                disabled={loading}
                type="submit" 
                className="bg-slate-900 text-white px-10 py-3 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 text-sm shadow-lg shadow-slate-900/10"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {initialData ? 'Update Article' : 'Publish Article'}
            </button>
        </div>
      </div>
    </form>
  );
}

