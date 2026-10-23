import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock, ArrowRight, ShieldCheck, Sun } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Verified Business Profile
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#123B52] leading-tight">
          About Sea View Cafe/Bar
        </h1>
        <p className="text-base text-gray-700 leading-relaxed max-w-3xl">
          Located along Triq Salvinu Vella in Il-Mellieħa, Malta, Sea View Cafe/Bar is a casual seaside café, breakfast restaurant, dining spot and bar overlooking the northern coast of the Maltese islands.
        </p>
      </div>

      {/* Visual Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80"
            alt="Mellieħa bay coastal view from terrace"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80"
            alt="Outdoor terrace seating in Malta"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Factual Core Details */}
      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
        <h2 className="font-serif text-2xl font-bold text-[#123B52]">
          Our Location & Offerings
        </h2>

        <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
          <p>
            Sea View Cafe/Bar serves local residents, workers, and international visitors visiting Mellieħa and Mellieħa Bay. Our kitchen and bar offer a variety of freshly prepared meals throughout the day, including traditional English-style cooked breakfasts, Maltese savoury specialities such as Ħobż biż-Żejt and ricotta ravioli, flame-grilled burgers, crispy fish & chips, freshly baked pastries, cold Maltese Cisk beer, and chilled wines.
          </p>

          <p>
            Our open-air terrace provides uninterrupted sea views across the Mediterranean, making it a popular choice for morning coffees, casual lunches, afternoon snacks, and sunset refreshments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 text-xs">
          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 space-y-1">
            <span className="font-bold text-[#123B52] block">Average Price Range</span>
            <span className="text-gray-600">€10–€20 per person</span>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 space-y-1">
            <span className="font-bold text-[#123B52] block">Verified Google Rating</span>
            <span className="text-gray-600">
              4.5 / 5 based on ~{settings.googleReviewCount.toLocaleString()} reviews
            </span>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 space-y-1">
            <span className="font-bold text-[#123B52] block">Location</span>
            <span className="text-gray-600">Triq Salvinu Vella, Il-Mellieħa</span>
          </div>
        </div>
      </div>

      {/* Verified Business Information */}
      <div className="bg-[#123B52] text-white p-8 sm:p-10 rounded-2xl space-y-6">
        <h2 className="font-serif text-2xl font-bold text-white">
          Verified Business Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#FAF7F0]/90">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#E98268]" />
              <strong className="text-white">Physical Address:</strong>
            </div>
            <p className="pl-6">{settings.address}, {settings.locality}, Malta</p>

            <div className="flex items-center gap-2 pt-2">
              <Phone className="w-4 h-4 text-[#E98268]" />
              <strong className="text-white">Telephone:</strong>
            </div>
            <p className="pl-6">{settings.phone}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#A9D6D5]" />
              <strong className="text-white">Standard Service Hours:</strong>
            </div>
            <p className="pl-6">Monday – Thursday: 08:00 – 22:00</p>
            <p className="pl-6">Friday – Saturday: 08:00 – 23:00</p>
            <p className="pl-6">Sunday: 08:00 – 22:00 (Europe/Malta Time)</p>
          </div>
        </div>

        <div className="pt-4 border-t border-[#287D91]/40 flex flex-wrap gap-4">
          <Link
            to="/menu"
            className="px-5 py-2.5 bg-white text-[#123B52] hover:bg-[#FAF7F0] font-semibold text-xs uppercase tracking-wider rounded-md transition-colors"
          >
            Explore Menu
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 border border-white/30 text-white hover:bg-white/10 font-semibold text-xs uppercase tracking-wider rounded-md transition-colors"
          >
            Contact Staff
          </Link>
        </div>
      </div>
    </div>
  );
};
