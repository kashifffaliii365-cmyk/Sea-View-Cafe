import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 bg-[#123B52]/10 text-[#123B52] rounded-full flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8 text-[#287D91]" />
      </div>

      <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
        Page Not Found · 404
      </span>

      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#123B52]">
        You've Veered Off the Coastal Path
      </h1>

      <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
        The page you are looking for does not exist or may have been moved. Return to the Sea View Cafe/Bar homepage or explore our food and drinks menu.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="px-5 py-2.5 bg-[#123B52] hover:bg-[#287D91] text-white text-xs uppercase tracking-wider font-semibold rounded-md transition-colors flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Home</span>
        </Link>
        <Link
          to="/menu"
          className="px-5 py-2.5 border border-[#123B52]/20 hover:bg-[#FAF7F0] text-[#123B52] text-xs uppercase tracking-wider font-semibold rounded-md transition-colors flex items-center gap-2"
        >
          <span>View Menu</span>
        </Link>
      </div>
    </div>
  );
};
