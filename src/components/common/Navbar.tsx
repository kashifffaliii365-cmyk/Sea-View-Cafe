import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Menu as MenuIcon, X, MapPin, Phone, Clock, Bell, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  onOpenCart?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const location = useLocation();
  const { cartCount, settings, notifications, triggerTestNotification } = useStore();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Menu', path: '/menu' },
    { label: 'Order', path: '/order' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'About', path: '/about' },
    { label: 'Find Us', path: '/find-us' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-[#123B52] text-[#FAF7F0] text-xs py-2 px-4 sm:px-8 border-b border-[#287D91]/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4 text-xs font-light tracking-wide">
            <span className="flex items-center gap-1.5 text-[#A9D6D5]">
              <MapPin className="w-3.5 h-3.5 text-[#E98268]" />
              {settings.address}, {settings.locality}, Malta
            </span>
            <span className="hidden md:inline text-white/30">|</span>
            <span className="hidden md:flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#A9D6D5]" />
              Open Daily from 08:00 (Malta Time)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-1.5 hover:text-[#A9D6D5] transition-colors"
            >
              <Phone className="w-3 h-3 text-[#E98268]" />
              <span>{settings.phone}</span>
            </a>
            <span className="text-white/30">|</span>
            <Link to="/track-order" className="hover:text-[#A9D6D5] transition-colors">
              Track Order
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#202B32]/10 transition-shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 flex items-center justify-between">
          {/* Brand Wordmark */}
          <Link to="/" className="flex flex-col group">
            <span className="font-serif text-2xl sm:text-2xl font-bold tracking-tight text-[#123B52] group-hover:text-[#287D91] transition-colors">
              Sea View Cafe/Bar
            </span>
            <span className="text-[11px] tracking-widest uppercase text-[#287D91] font-medium">
              Mellieħa · Malta
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative py-1 ${
                  isActive(link.path)
                    ? 'text-[#123B52] font-semibold'
                    : 'text-[#202B32]/80 hover:text-[#123B52]'
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#E98268] rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Actions: Cart and Order Now button */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/order"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-[#123B52] hover:bg-[#287D91] rounded-md transition-colors shadow-sm"
            >
              Order Online
            </Link>

            {/* Order Updates Notifications Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                type="button"
                aria-label={`Order alerts (${notifications.length})`}
                className="relative p-2.5 text-[#123B52] hover:text-[#287D91] hover:bg-[#FAF7F0] rounded-md transition-colors"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#E98268] rounded-full ring-2 ring-white" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 py-3 z-50">
                  <div className="px-4 pb-2 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Bell className="w-4 h-4 text-[#123B52]" />
                      <span className="font-serif font-bold text-sm text-[#123B52]">
                        Order Status Alerts
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerTestNotification()}
                      className="text-[11px] font-semibold text-[#287D91] hover:underline"
                    >
                      Test Alert
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400">
                        No recent order status alerts yet. Once an order is placed, live updates will appear here.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <Link
                          key={n.id}
                          to={n.url}
                          onClick={() => setNotifDropdownOpen(false)}
                          className="p-3 hover:bg-[#FAF7F0] transition-colors block text-xs"
                        >
                          <div className="flex items-center justify-between text-[10px] text-gray-400">
                            <span className="font-mono text-[#123B52] font-bold">{n.orderNumber}</span>
                            <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="font-bold text-gray-900 mt-0.5">{n.title}</div>
                          <p className="text-gray-600 text-[11px] mt-0.5 line-clamp-1">{n.body}</p>
                        </Link>
                      ))
                    )}
                  </div>

                  <div className="px-4 pt-2 border-t border-gray-100 text-center">
                    <Link
                      to="/track-order"
                      onClick={() => setNotifDropdownOpen(false)}
                      className="text-xs font-semibold text-[#123B52] hover:text-[#287D91]"
                    >
                      Open Live Order Tracker →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              type="button"
              aria-label={`Shopping bag with ${cartCount} items`}
              className="relative p-2.5 text-[#123B52] hover:text-[#287D91] hover:bg-[#FAF7F0] rounded-md transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E98268] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              type="button"
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-[#123B52] hover:bg-[#FAF7F0] rounded-md transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-[#123B52]/60 backdrop-blur-sm flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-6 border-b border-gray-100">
              <div className="flex flex-col">
                <span className="font-serif text-xl font-bold text-[#123B52]">Sea View Cafe/Bar</span>
                <span className="text-[10px] uppercase tracking-wider text-[#287D91]">Mellieħa, Malta</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-900 rounded-md"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-4 py-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`text-base py-2 transition-colors ${
                    isActive(link.path)
                      ? 'text-[#123B52] font-semibold border-l-2 border-[#E98268] pl-3'
                      : 'text-[#202B32]/80 hover:text-[#123B52] pl-3'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base py-2 text-[#202B32]/80 pl-3 hover:text-[#123B52]"
              >
                Track Order
              </Link>
              <Link
                to="/offers"
                onClick={() => setMobileMenuOpen(false)}
                className="text-base py-2 text-[#202B32]/80 pl-3 hover:text-[#123B52]"
              >
                Special Offers
              </Link>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col gap-3">
              <Link
                to="/order"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-3 bg-[#123B52] text-white rounded-md font-medium text-sm hover:bg-[#287D91] transition-colors"
              >
                Start Online Order
              </Link>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="w-full text-center py-2.5 border border-[#123B52]/20 text-[#123B52] rounded-md font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#FAF7F0]"
              >
                <Phone className="w-4 h-4 text-[#E98268]" />
                Call {settings.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
