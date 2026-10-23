import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, MapPin, Phone, CheckCircle2, ShoppingBag, Compass, Star } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductCustomizeModal } from '../components/ui/ProductCustomizeModal';
import { Product } from '../types';

interface HomePageProps {
  onOpenCart?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onOpenCart }) => {
  const { products, categories, settings, gallery } = useStore();
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);

  // Popular verified dishes
  const popularDishes = products.filter((p) => p.isPopular).slice(0, 6);

  return (
    <div className="space-y-20 pb-20">
      {/* A. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#123B52] text-white">
        {/* Background Image with layered Mediterranean coastal gradient */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=2000&q=85"
            alt="Mellieħa Bay coastline and turquoise Mediterranean waters"
            className="w-full h-full object-cover object-center scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#123B52]/95 via-[#123B52]/80 to-[#123B52]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#123B52] via-transparent to-black/20" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-24 sm:py-32 w-full">
          <div className="max-w-2xl space-y-6">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#A9D6D5] font-semibold">
              <Compass className="w-4 h-4 text-[#E98268]" />
              <span>Triq Salvinu Vella · Il-Mellieħa, Malta</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
              Sea View Cafe/Bar
            </h1>

            <p className="text-base sm:text-lg text-[#FAF7F0]/90 leading-relaxed font-light">
              Seaside breakfast restaurant, casual lunch, Maltese specialities, draught Cisk beer and refreshing cocktails overlooking the azure waters of northern Malta.
            </p>

            {/* Quick business verification pill */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#FAF7F0]/80 pt-1">
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#E98268] fill-[#E98268]" />
                <strong className="text-white">4.5 / 5</strong> ({settings.googleReviewCount.toLocaleString()} Google reviews)
              </span>
              <span className="text-white/30">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#A9D6D5]" />
                <span>Open Daily from 08:00</span>
              </span>
              <span className="text-white/30">·</span>
              <span>€10–€20 per person</span>
            </div>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/menu"
                className="px-6 py-3.5 bg-white text-[#123B52] hover:bg-[#FAF7F0] font-semibold text-xs uppercase tracking-wider rounded-md transition-all shadow-md flex items-center gap-2 group"
              >
                <span>View Full Menu</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/order"
                className="px-6 py-3.5 bg-[#E98268] hover:bg-[#d67258] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-all shadow-md flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order for Pickup or Delivery</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Ambient Bottom Wave Shape */}
        <div className="absolute bottom-0 inset-x-0 h-8 bg-[#FAF7F0]" style={{ clipPath: 'ellipse(60% 100% at 50% 100%)' }} />
      </section>

      {/* B. Food & Drink Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
              Freshly Prepared Daily
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52] mt-1">
              Food & Drinks Menu Categories
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs font-semibold uppercase tracking-wider text-[#123B52] hover:text-[#287D91] flex items-center gap-1 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length;
            return (
              <Link
                key={cat.id}
                to={`/menu/${cat.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 border border-[#123B52]/10 hover:shadow-lg transition-all"
              >
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('1533089860892')) {
                      target.src = 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=800&q=80';
                    }
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#123B52]/90 via-[#123B52]/40 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-4 text-white">
                  <h3 className="font-serif text-base sm:text-lg font-bold group-hover:text-[#A9D6D5] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-[#FAF7F0]/80">
                    {count} {count === 1 ? 'item' : 'items'}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* C. Popular Verified Menu Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
              Customer Favourites
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52] mt-1">
              Popular Menu Choices
            </h2>
          </div>
          <Link
            to="/menu"
            className="text-xs font-semibold uppercase tracking-wider text-[#123B52] hover:text-[#287D91] flex items-center gap-1 transition-colors"
          >
            <span>Browse Full Menu</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularDishes.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenQuickView={(p) => setCustomizingProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* D. How Online Ordering Works */}
      <section className="bg-white py-16 border-y border-[#123B52]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="max-w-xl mx-auto text-center space-y-3 mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
              Convenient & Simple
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52]">
              Order Direct from Sea View Cafe/Bar
            </h2>
            <p className="text-xs text-[#202B32]/75 leading-relaxed">
              Skip the queue by ordering in advance for counter collection, or enjoy doorstep delivery across Mellieħa and surrounding coastal zones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#123B52] text-white flex items-center justify-center font-bold text-sm font-sans">
                01
              </div>
              <h3 className="font-serif text-lg font-bold text-[#123B52]">Select Your Items</h3>
              <p className="text-xs text-[#202B32]/80 leading-relaxed">
                Choose cooked breakfasts, wraps, burgers, desserts or chilled drinks. Customise sizes, add extra toppings, or add kitchen notes.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#287D91] text-white flex items-center justify-center font-bold text-sm font-sans">
                02
              </div>
              <h3 className="font-serif text-lg font-bold text-[#123B52]">Pickup or Delivery</h3>
              <p className="text-xs text-[#202B32]/80 leading-relaxed">
                Choose prompt pickup from our counter on Triq Salvinu Vella, or select local delivery to Mellieħa, Manikata, or Xemxija.
              </p>
            </div>

            <div className="p-6 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E98268] text-white flex items-center justify-center font-bold text-sm font-sans">
                03
              </div>
              <h3 className="font-serif text-lg font-bold text-[#123B52]">Live Order Tracking</h3>
              <p className="text-xs text-[#202B32]/80 leading-relaxed">
                Receive your unique order reference code instantly. Follow kitchen preparation in real-time as your meal is cooked fresh.
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/order"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#123B52] hover:bg-[#287D91] text-white text-xs uppercase tracking-wider font-semibold rounded-md transition-colors shadow-sm"
            >
              <span>Start an Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* E. Sea-View Gallery Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
              Mellieħa Bay & Terrace
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#123B52] mt-1">
              Coastal Views & Café Atmosphere
            </h2>
          </div>
          <Link
            to="/gallery"
            className="text-xs font-semibold uppercase tracking-wider text-[#123B52] hover:text-[#287D91] flex items-center gap-1 transition-colors"
          >
            <span>View Full Gallery ({gallery.length} Photos)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {gallery.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="group relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 border border-[#123B52]/10"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 inset-x-0 p-5 text-white">
                <h4 className="font-serif text-base font-semibold">{item.title}</h4>
                <p className="text-xs text-white/80 mt-1 line-clamp-1">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* F. Location & Contact Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#123B52] rounded-2xl overflow-hidden text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 space-y-6 flex flex-col justify-center">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-[#A9D6D5]">
                  Find Us in Mellieħa
                </span>
                <h2 className="font-serif text-3xl font-bold text-white mt-1">
                  Visit Sea View Cafe/Bar
                </h2>
              </div>

              <p className="text-sm text-[#FAF7F0]/85 leading-relaxed">
                Enjoy open sea breezes and terrace dining overlooking Mellieħa bay on the northern coast of Malta. Accessible street parking and public bus links nearby.
              </p>

              <div className="space-y-3 text-sm text-[#FAF7F0]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-[#E98268]" />
                  <span>{settings.address}, {settings.locality}, Malta</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#E98268]" />
                  <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-[#A9D6D5] transition-colors">
                    {settings.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#A9D6D5]" />
                  <span>Open Daily from 08:00 (Europe/Malta Time)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to="/find-us"
                  className="px-5 py-2.5 bg-white text-[#123B52] hover:bg-[#FAF7F0] font-semibold text-xs uppercase tracking-wider rounded-md transition-colors"
                >
                  Map & Directions
                </Link>
                <Link
                  to="/contact"
                  className="px-5 py-2.5 border border-white/30 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors"
                >
                  Contact Staff
                </Link>
              </div>
            </div>

            {/* Visual preview */}
            <div className="relative min-h-[300px] lg:min-h-full bg-gray-200">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80"
                alt="Sea View Cafe/Bar terrace seating overlooking Mellieħa Bay"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#123B52]/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Customize Modal */}
      {customizingProduct && (
        <ProductCustomizeModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAdded={onOpenCart}
        />
      )}
    </div>
  );
};
