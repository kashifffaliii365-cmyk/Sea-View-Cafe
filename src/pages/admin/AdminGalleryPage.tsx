import React, { useState } from 'react';
import { Image, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { GalleryPhoto } from '../../types';

export const AdminGalleryPage: React.FC = () => {
  const { gallery, addGalleryPhoto, deleteGalleryPhoto } = useStore();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GalleryPhoto['category']>('coastal_views');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    addGalleryPhoto({
      title: title.trim(),
      category,
      imageUrl: imageUrl.trim(),
      caption: caption.trim(),
      isAuthenticMellieha: true,
    });

    setTitle('');
    setImageUrl('');
    setCaption('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
            Gallery Image Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Curate authentic photos of Mellieħa coastline, terrace seating, and food dishes.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(!showAdd)}
          className="px-4 py-2 bg-[#123B52] hover:bg-[#287D91] text-white text-xs font-semibold uppercase tracking-wider rounded-md flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{showAdd ? 'Close' : 'Add Image'}</span>
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4 text-xs">
          <h3 className="font-serif text-base font-bold text-[#123B52]">Add Gallery Photo</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Afternoon Terrace View"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2 border border-gray-200 rounded bg-white"
              >
                <option value="coastal_views">Coastal Views</option>
                <option value="seating">Terrace Seating</option>
                <option value="food">Food</option>
                <option value="drinks">Drinks</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Image URL *</label>
              <input
                type="url"
                required
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block font-semibold text-gray-700 mb-1">Caption</label>
              <input
                type="text"
                placeholder="Short descriptive caption..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-5 py-2 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold rounded text-xs"
            >
              Add to Gallery
            </button>
          </div>
        </form>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gallery.map((img) => (
          <div key={img.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm flex flex-col justify-between">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
              <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
              <span className="absolute top-2 left-2 bg-[#123B52]/90 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                {img.category.replace('_', ' ')}
              </span>
            </div>
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h4 className="font-bold text-gray-900 text-xs truncate">{img.title}</h4>
                <p className="text-[11px] text-gray-500 line-clamp-1">{img.caption}</p>
              </div>
              <button
                onClick={() => deleteGalleryPhoto(img.id)}
                className="p-1.5 text-gray-400 hover:text-red-600 border border-gray-200 rounded shrink-0"
                title="Delete Photo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
