import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ExternalLink, ShieldCheck, Lock } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#123B52] text-[#FAF7F0] border-t border-[#287D91]/30">
      {/* Main Footer Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Column 1: Identity & Reference Details */}
          <div className="space-y-4">
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Sea View Cafe/Bar
              </span>
              <span className="text-xs uppercase tracking-widest text-[#A9D6D5] font-medium mt-0.5">
                Mellieħa · Malta
              </span>
            </div>
            <p className="text-sm text-[#FAF7F0]/80 leading-relaxed">
              Casual seaside dining, cooked breakfasts, wraps, burgers, freshly prepared local dishes, cold Cisk beers and coastal drinks overlooking the Mediterranean in northern Malta.
            </p>

            {/* Google Rating Reference Data */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-[#287D91]/30 px-3 py-2 rounded-md border border-[#A9D6D5]/20 text-xs text-[#FAF7F0]">
                <span className="text-[#E98268] font-bold text-sm">★ 4.5 / 5</span>
                <span className="text-white/40">·</span>
                <span>Based on ~3,332 customer reviews on Google</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links & Menus */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-[#287D91]/40 pb-2">
              Explore & Order
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FAF7F0]/85">
              <li>
                <Link to="/menu" className="hover:text-[#A9D6D5] transition-colors">
                  Full Food & Drinks Menu
                </Link>
              </li>
              <li>
                <Link to="/order" className="hover:text-[#A9D6D5] transition-colors">
                  Order for Pickup or Delivery
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-[#A9D6D5] transition-colors">
                  Live Order Tracker
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#A9D6D5] transition-colors">
                  Terrace & Coast Gallery
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#A9D6D5] transition-colors">
                  Current Promotions & Offers
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#A9D6D5] transition-colors">
                  About Our Café
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#A9D6D5] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Visiting */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-[#287D91]/40 pb-2">
              Location & Contact
            </h4>
            <ul className="space-y-3 text-sm text-[#FAF7F0]/85">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E98268] shrink-0 mt-0.5" />
                <span>
                  {settings.address}, {settings.locality}, Malta
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E98268] shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="hover:text-[#A9D6D5] transition-colors font-medium"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#A9D6D5] shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="hover:text-[#A9D6D5] transition-colors"
                >
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5 pt-1">
                <Clock className="w-4 h-4 text-[#A9D6D5] shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white">Daily Kitchen & Bar Hours</div>
                  <div className="text-xs text-[#FAF7F0]/70 mt-0.5">
                    Mon – Thu & Sun: 08:00 – 22:00
                  </div>
                  <div className="text-xs text-[#FAF7F0]/70">
                    Fri – Sat: 08:00 – 23:00 (Malta Time)
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 4: Malta & EU Compliance / Socials */}
          <div className="space-y-4">
            <h4 className="font-serif text-base font-semibold text-white tracking-wide border-b border-[#287D91]/40 pb-2">
              Customer Information
            </h4>
            <ul className="space-y-2 text-xs text-[#FAF7F0]/80">
              <li>
                <Link to="/delivery-policy" className="hover:text-[#A9D6D5] transition-colors">
                  Delivery Policy & Zones
                </Link>
              </li>
              <li>
                <Link to="/refund-and-cancellation" className="hover:text-[#A9D6D5] transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#A9D6D5] transition-colors">
                  GDPR Privacy Notice
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-[#A9D6D5] transition-colors">
                  Cookie Policy & Preferences
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="hover:text-[#A9D6D5] transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="hover:text-[#A9D6D5] transition-colors">
                  Accessibility Statement
                </Link>
              </li>
            </ul>

            <div className="pt-3 border-t border-[#287D91]/30">
              <span className="text-xs text-[#A9D6D5] block mb-2 font-medium">Connect with Us</span>
              <div className="flex gap-3 text-xs">
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#A9D6D5] transition-colors bg-[#287D91]/30 px-2.5 py-1.5 rounded"
                >
                  <span>Facebook</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href={settings.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[#A9D6D5] transition-colors bg-[#287D91]/30 px-2.5 py-1.5 rounded"
                >
                  <span>Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#287D91]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF7F0]/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#A9D6D5]" />
            <span>
              © {new Date().getFullYear()} Sea View Cafe/Bar. Triq Salvinu Vella, Il-Mellieħa, Malta. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/admin/login"
              className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Staff Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
