import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { GalleryPhoto } from '../types';
import { X, ZoomIn } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useStore();
  const [filter, setFilter] = useState<'all' | 'coastal_views' | 'seating' | 'food' | 'drinks'>('all');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const filteredGallery = filter === 'all'
    ? gallery
    : gallery.filter((item) => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-[#123B52]/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Sea View Cafe/Bar · Photo Showcase
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          Terrace, Coast & Dining Gallery
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 mt-2 max-w-2xl leading-relaxed">
          Glimpse the open Mediterranean sea views from our terrace on Triq Salvinu Vella in Mellieħa, along with our freshly prepared breakfasts, coffees, and coastal drinks.
        </p>

        {/* Filter Segmented Controls */}
        <div className="mt-6 flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'coastal_views', label: 'Coastal Views' },
            { id: 'seating', label: 'Terrace Seating' },
            { id: 'food', label: 'Dishes' },
            { id: 'drinks', label: 'Drinks & Coffee' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-4 py-2 rounded-md text-xs font-semibold uppercase tracking-wider transition-colors ${
                filter === tab.id
                  ? 'bg-[#123B52] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-[#FAF7F0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActivePhoto(item)}
            className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 cursor-pointer border border-[#123B52]/10 shadow-sm"
          >
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              onError={(e) => {
                const target = e.currentTarget;
                if (!target.src.includes('1544644181')) {
                  target.src = 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80';
                }
              }}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5 text-white">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-base font-bold">{item.title}</h4>
                <ZoomIn className="w-4 h-4 text-[#A9D6D5]" />
              </div>
              <p className="text-xs text-white/80 mt-1 line-clamp-2">{item.caption}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActivePhoto(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
            aria-label="Close photo preview"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full bg-[#123B52] rounded-xl overflow-hidden shadow-2xl text-white">
            <div className="max-h-[70vh] bg-black/40 flex items-center justify-center overflow-hidden">
              <img
                src={activePhoto.imageUrl}
                alt={activePhoto.title}
                className="max-h-[70vh] w-auto max-w-full object-contain"
              />
            </div>
            <div className="p-6 space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#A9D6D5] font-semibold">
                Sea View Cafe/Bar · Mellieħa, Malta
              </span>
              <h3 className="font-serif text-xl font-bold">{activePhoto.title}</h3>
              <p className="text-xs text-[#FAF7F0]/80 pt-1 leading-relaxed">
                {activePhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
