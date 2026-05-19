'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createProduct, updateProduct } from '@/actions/productActions';
import { uploadImage } from '@/actions/uploadActions';
import toast from 'react-hot-toast';
import { Plus, Trash2, Loader2, Save, CheckCircle2, Star, Upload, Zap, Globe } from 'lucide-react';

interface ProductFormProps {
  initialData?: any;
  categories: any[];
  platforms: any[];
}

export default function ProductForm({ initialData, categories, platforms }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingStates, setUploadingStates] = useState<{ [key: number]: boolean }>({});

  const handleLocalUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingStates(prev => ({ ...prev, [index]: true }));
    const data = new FormData();
    data.append('file', file);

    try {
      const res = await uploadImage(data);
      if (res.success && res.url) {
        handleImageChange(index, res.url);
        toast.success(`Image ${index + 1} uploaded!`);
      } else {
        toast.error(res.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image');
    } finally {
      setUploadingStates(prev => ({ ...prev, [index]: false }));
      e.target.value = '';
    }
  };

  const [fetchUrl, setFetchUrl] = useState('');
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  const handleAutoFetchDetails = async () => {
    // Split input by newlines to support scanning multiple URLs at once
    const urls = fetchUrl
      .split('\n')
      .map(u => u.trim())
      .filter(u => u.startsWith('http://') || u.startsWith('https://'));

    if (urls.length === 0) {
      toast.error('Please enter at least one valid product URL (starting with http:// or https://)');
      return;
    }
    
    setIsFetchingDetails(true);
    const loadingToast = toast.loading(`Connecting & scraping details from ${urls.length} product page(s)...`);
    
    try {
      const response = await fetch('/api/affiliate/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      });
      const result = await response.json();
      
      toast.dismiss(loadingToast);
      
      if (result.success && result.data) {
        const data = result.data;
        
        // Auto-fill form data (No fallback fake content; if not found, we leave it blank/empty)
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          rating: data.rating ? data.rating.toString() : '',
          images: data.images && data.images.length > 0 ? data.images : [''],
          features: data.features && data.features.length > 0 ? data.features : [''],
        }));
        
        // Auto-fill multiple platform offers dynamically
        if (data.offers && data.offers.length > 0) {
          setOffers(data.offers);
        } else {
          setOffers([
            { platform: '', price: '', affiliateLink: '', logo: '/placeholder-logo-vectors.svg', label: '', isAvailable: true }
          ]);
        }
        
        toast.success(`Form synced successfully! Created ${data.offers?.length || 0} real platform offers.`);
      } else {
        toast.error(result.error || 'Failed to auto-fetch product details');
      }
    } catch (error) {
      console.error(error);
      toast.dismiss(loadingToast);
      toast.error('An error occurred while auto-fetching product details');
    } finally {
      setIsFetchingDetails(false);
    }
  };

  const [syncingOfferIndex, setSyncingOfferIndex] = useState<number | null>(null);

  const handleSyncOffer = async (index: number) => {
    const offerUrl = offers[index].affiliateLink;
    if (!offerUrl || !offerUrl.trim()) {
      toast.error('Please enter a valid Affiliate Link first');
      return;
    }

    setSyncingOfferIndex(index);
    const loadingToast = toast.loading('Syncing offer details dynamically...');

    try {
      const response = await fetch('/api/affiliate/fetch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: [offerUrl.trim()] }),
      });
      const result = await response.json();

      toast.dismiss(loadingToast);

      if (result.success && result.data && result.data.offers && result.data.offers.length > 0) {
        const syncedOffer = result.data.offers[0];
        
        const newOffers = [...offers];
        newOffers[index] = {
          ...newOffers[index],
          platform: syncedOffer.platform || '',
          price: syncedOffer.price ? syncedOffer.price.toString() : '',
          isAvailable: syncedOffer.isAvailable !== undefined ? syncedOffer.isAvailable : true,
          label: syncedOffer.label || '',
        };

        if (syncedOffer.logo) {
          newOffers[index].logo = syncedOffer.logo;
        } else {
          const selectedPlatform = platforms.find(p => p.name === syncedOffer.platform);
          if (selectedPlatform && selectedPlatform.logo) {
            newOffers[index].logo = selectedPlatform.logo;
          }
        }

        setOffers(newOffers);
        toast.success(`Synced offer successfully! Platform: ${syncedOffer.platform || 'Generic'}`);
      } else {
        toast.error(result.error || 'Failed to sync details. Link might be blocked or currently invalid.');
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error('An error occurred while syncing the offer details');
    } finally {
      setSyncingOfferIndex(null);
    }
  };

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    slug: initialData?.slug || '',
    description: initialData?.description || '',
    rating: initialData?.rating || '',
    categoryId: initialData?.categoryId || '',
    images: initialData?.images && initialData.images.length > 0 ? initialData.images : [''],
    features: initialData?.features && initialData.features.length > 0 ? initialData.features : [''],
  });

  const [offers, setOffers] = useState(initialData?.offers || [
    { platform: '', price: '', affiliateLink: '', logo: '/placeholder-logo-vectors.svg', label: '', isAvailable: true }
  ]);

  const handleAddOffer = () => {
    setOffers([...offers, { platform: '', price: '', affiliateLink: '', logo: '/placeholder-logo-vectors.svg', label: '', isAvailable: true }]);
  };

  const handleRemoveOffer = (index: number) => {
    setOffers(offers.filter((_: any, i: number) => i !== index));
  };

  const handleOfferChange = (index: number, field: string, value: any) => {
    const newOffers = [...offers];

    // Auto-detect logo from platform management
    if (field === 'platform') {
      const selectedPlatform = platforms.find(p => p.name === value);
      if (selectedPlatform && selectedPlatform.logo) {
        newOffers[index].logo = selectedPlatform.logo;
      } else {
        // Fallback to old hardcoded detection if not in management or no logo
        const plat = value.toLowerCase();
        if (plat.includes('amazon')) newOffers[index].logo = '/placeholder-logo-vectors.svg';
        else if (plat.includes('flipkart')) newOffers[index].logo = '/flipkart.png';
        else if (plat.includes('meesho')) newOffers[index].logo = '/meesho.png';
      }
    }

    // Fallback to default placeholder if logo is cleared
    let finalValue = value;
    if (field === 'logo' && !value) {
      finalValue = '/placeholder-logo-vectors.svg';
    }

    newOffers[index] = { ...newOffers[index], [field]: finalValue };
    setOffers(newOffers);
  };


  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData({ ...formData, name, slug });
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_: any, i: number) => i !== index) });
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({ ...formData, images: newImages });
  };

  const addImage = () => {
    setFormData({ ...formData, images: [...formData.images, ''] });
  };

  const removeImage = (index: number) => {
    setFormData({ ...formData, images: formData.images.filter((_: any, i: number) => i !== index) });
  };

  const setAsMain = (index: number) => {
    if (index === 0) return;
    const newImages = [...formData.images];
    const [selectedImage] = newImages.splice(index, 1);
    newImages.unshift(selectedImage);
    setFormData({ ...formData, images: newImages });
    toast.success('Main image updated!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('slug', formData.slug);
    data.append('description', formData.description);
    data.append('rating', formData.rating);
    data.append('categoryId', formData.categoryId);
    data.append('images', formData.images.filter((i: string) => i.trim() !== '').join('\n'));
    data.append('features', formData.features.filter((f: string) => f.trim() !== '').join('\n'));
    
    // Calculate main price from offers
    const validPrices = offers.map((o: any) => parseFloat(o.price)).filter((p: number) => !isNaN(p));
    const minPrice = validPrices.length > 0 ? Math.min(...validPrices) : 0;
    data.append('price', minPrice.toString());

    data.append('offers', JSON.stringify(offers));

    const res = initialData
      ? await updateProduct(initialData.id, data)
      : await createProduct(data);

    if (res.success) {
      toast.success(initialData ? 'Product updated!' : 'Product created!');
      // Stay on current page; simply refresh if needed
      router.refresh();
    } else {
      toast.error(res.error || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* Premium Auto-Fetch Section */}
      <div className="bg-slate-900 text-white p-8 rounded-[2rem] border border-slate-850 shadow-xl space-y-6 relative overflow-hidden group">
        {/* Glow element for visual aesthetics */}
        <div className="absolute -right-24 -top-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/15 transition-all duration-700" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-400">
              <Zap size={10} className="fill-blue-400" /> Supercharged Auto Import
            </span>
            <h2 className="text-2xl font-black tracking-tight text-white">Import from URL</h2>
            <p className="text-slate-400 text-xs font-medium">Paste an Amazon, Flipkart, or Meesho product link to automatically pre-fill the name, description, images, features, and affiliate price offers.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start relative z-10 w-full">
          <div className="relative flex-1 w-full">
            <Globe className="absolute left-5 top-5 text-slate-500 w-5 h-5" />
            <textarea
              value={fetchUrl}
              onChange={(e) => setFetchUrl(e.target.value)}
              placeholder="Paste one or more product URLs here (one per line)&#10;e.g.&#10;https://www.amazon.in/dp/B07D1K3547&#10;https://www.flipkart.com/product-link"
              rows={3}
              className="w-full pl-14 pr-6 py-4 bg-slate-950/80 border border-slate-800 rounded-2xl outline-none focus:border-blue-500 font-medium text-sm text-slate-200 placeholder:text-slate-700 transition-all shadow-inner resize-none min-h-[90px]"
            />
          </div>
          <button
            type="button"
            disabled={isFetchingDetails}
            onClick={handleAutoFetchDetails}
            className="w-full md:w-auto px-8 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shrink-0 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-98 shadow-lg shadow-blue-600/20 cursor-pointer self-stretch md:self-auto h-[90px]"
          >
            {isFetchingDetails ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Fetching...</span>
              </>
            ) : (
              <>
                <Zap size={16} className="fill-white text-white" />
                <span>Auto-Fill Form</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Side: Basic Info */}
        <div className="space-y-6 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">Basic Information</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Product Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={handleNameChange}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Philips Trimmer 9000"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">URL Slug</label>
              <input
                required
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                className="w-full bg-white border border-slate-200 rounded-xl p-3 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="philips-trimmer-9000"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Please select Category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Rating (0.5 - 5.0)</label>
                <select
                  required
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl p-3 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none transition-all cursor-pointer"
                >
                  <option value="" disabled>Please select Rating</option>
                  {[5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.5].map(num => (
                    <option key={num} value={num}>{num} ★</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-[120px] bg-white border border-slate-200 rounded-xl p-3 font-medium text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                placeholder="Briefly describe the product for SEO..."
              />
            </div>
          </div>
        </div>

        {/* Right Side: Media & Features */}
        <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="space-y-8">
            {/* Images Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Product Images</h2>
                <button
                  type="button"
                  onClick={addImage}
                  className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
                >
                  <Plus size={16} /> Add Image
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.images.map((image: string, index: number) => (
                  <div key={index} className="flex gap-3 items-center">
                    <div className="flex-1 flex gap-2 items-center">
                      <div className="relative flex-1">
                        <input
                          required
                          type="text"
                          value={image}
                          onChange={(e) => handleImageChange(index, e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 pl-10 font-medium text-slate-900 focus:border-blue-500 outline-none transition-all text-sm"
                          placeholder="https://image-url.jpg or upload"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                          {index + 1}
                        </div>
                      </div>

                      {/* File input (hidden) */}
                      <input
                        type="file"
                        id={`product-image-upload-${index}`}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleLocalUpload(index, e)}
                      />

                      {/* Upload Button */}
                      <button
                        type="button"
                        onClick={() => document.getElementById(`product-image-upload-${index}`)?.click()}
                        disabled={uploadingStates[index]}
                        className="px-4 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shrink-0"
                        title="Upload from Gallery"
                      >
                        {uploadingStates[index] ? (
                          <Loader2 size={14} className="animate-spin text-blue-600" />
                        ) : (
                          <Upload size={14} />
                        )}
                        <span>Upload</span>
                      </button>
                    </div>

                    {image && (
                      <div className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${index === 0 ? 'border-amber-400 shadow-lg shadow-amber-100' : 'border-slate-200'}`}>
                        <img src={image} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center">
                      {index !== 0 && image && (
                        <button
                          type="button"
                          onClick={() => setAsMain(index)}
                          className="p-1 text-slate-300 hover:text-amber-500 transition-colors"
                          title="Set as Main Image"
                        >
                          <Star size={16} />
                        </button>
                      )}
                      {index === 0 && (
                        <div className="p-1 text-amber-700">
                          <Star size={16} fill="currentColor" /> 
                        </div>
                      )}
                      <div className="h-6 w-px bg-slate-100 mx-2" />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
                
            {/* Features Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h2 className="text-xl font-bold text-slate-900">Key Features</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
                >
                  <Plus size={16} /> Add Feature
                </button>
              </div>
              
              <div className="space-y-3">
                {formData.features.map((feature: string, index: number) => (
                  <div key={index} className="flex gap-3 items-center">
                    <input
                      required
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 font-medium text-slate-900 focus:border-blue-500 outline-none transition-all text-sm"
                      placeholder="e.g. Super fast charging"
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offers Section - Simplified Classic Design */}
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-wider">Affiliate Offers</h2>
          <button
            type="button"
            onClick={handleAddOffer}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100"
          >
            <Plus size={16} /> Add Platform
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {offers.map((offer: any, index: number) => (
            <div key={index} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6 transition-all">
              {/* Row 1: Logo, Platform, Price, Badge */}
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Logo Preview */}
                <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center p-2 shrink-0 overflow-hidden">
                  <img src={offer.logo || '/placeholder-logo-vectors.svg'} alt="L" className="w-full h-full object-contain" onError={(e) => (e.currentTarget.src = '/placeholder-logo-vectors.svg')} />
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Platform Name</label>
                    <select
                      required
                      value={offer.platform}
                      onChange={(e) => handleOfferChange(index, 'platform', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                    >
                      <option value="" disabled>Select Platform</option>
                      {platforms.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Offer Price (₹)</label>
                    <input
                      required
                      type="number"
                      value={offer.price}
                      onChange={(e) => handleOfferChange(index, 'price', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Special Badge</label>
                    <input
                      type="text"
                      list={`badge-suggestions-${index}`}
                      value={offer.label || ''}
                      onChange={(e) => handleOfferChange(index, 'label', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all text-xs"
                      placeholder="e.g. Best Price"
                    />
                    <datalist id={`badge-suggestions-${index}`}>
                      <option value="Best Price" />
                      <option value="Limited Offer" />
                      <option value="Exclusive Deal" />
                      <option value="Popular Choice" />
                      <option value="New Arrival" />
                    </datalist>
                  </div>
                </div>
              </div>

              {/* Row 2: Affiliate Link, Stock Toggle, Delete Button */}
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Affiliate Link / Button URL</label>
                    {offer.affiliateLink && (
                      <button
                        type="button"
                        onClick={() => handleSyncOffer(index)}
                        disabled={syncingOfferIndex === index}
                        className="text-[9px] font-black uppercase tracking-wider text-blue-600 hover:text-blue-500 flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {syncingOfferIndex === index ? (
                          <>
                            <Loader2 size={10} className="animate-spin" />
                            <span>Syncing...</span>
                          </>
                        ) : (
                          <>
                            <Zap size={10} className="fill-blue-600 text-blue-600 animate-pulse" />
                            <span>Auto-Fill Offer</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      required
                      type="url"
                      value={offer.affiliateLink}
                      onChange={(e) => handleOfferChange(index, 'affiliateLink', e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-12 py-3 font-medium text-slate-900 outline-none focus:bg-white focus:border-blue-500 transition-all text-sm"
                      placeholder="e.g. https://amzn.in/d/07XFG1k2"
                    />
                    {offer.affiliateLink && (
                      <button
                        type="button"
                        onClick={() => handleSyncOffer(index)}
                        disabled={syncingOfferIndex === index}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 border border-slate-200 rounded-lg transition-all cursor-pointer"
                        title="Auto-Fill This Offer"
                      >
                        {syncingOfferIndex === index ? (
                          <Loader2 size={14} className="animate-spin text-blue-600" />
                        ) : (
                          <Zap size={14} className="text-blue-500 fill-blue-500" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100 min-w-fit mt-5 md:mt-0">
                  <input
                    type="checkbox"
                    id={`stock-${index}`}
                    checked={!Boolean(offer.isAvailable ?? true)}
                    onChange={(e) => handleOfferChange(index, 'isAvailable', !e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor={`stock-${index}`} className="text-[10px] font-black uppercase tracking-widest text-slate-500 cursor-pointer">Out of Stock</label>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveOffer(index)}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all mt-5 md:mt-0"
                  title="Remove Platform"
                >
                  <Trash2 size={22} />
                </button>
              </div>
            </div>
          ))}
        </div>


      </div>


      {/* Sticky Action Bar */}
      <div className="sticky bottom-8 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-all text-sm"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="bg-slate-900 text-white px-10 py-2.5 rounded-xl font-bold uppercase tracking-wider hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50 text-sm"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {initialData ? 'Update Product' : 'Publish Product'}
        </button>
      </div>
    </form>
  );
}
