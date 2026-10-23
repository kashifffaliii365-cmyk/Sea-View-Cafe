import React from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  PackageCheck,
  Tag,
  Users,
  Image,
  Settings,
  BarChart3,
  LogOut,
  ExternalLink,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, staffUser, logoutStaff, orders } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Live Orders', path: '/admin/orders', icon: ShoppingBag, badge: pendingOrdersCount },
    { label: 'Menu Items', path: '/admin/menu', icon: UtensilsCrossed },
    { label: 'New Product', path: '/admin/products/new', icon: PlusCircle },
    { label: 'Stock & Inventory', path: '/admin/inventory', icon: PackageCheck },
    { label: 'Promotions', path: '/admin/offers', icon: Tag },
    { label: 'Enquiries', path: '/admin/customers', icon: Users },
    { label: 'Gallery Photos', path: '/admin/gallery', icon: Image },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logoutStaff();
    navigate('/admin/login');
  };

  const isActive = (path: string) => {
    if (path === '/admin' && location.pathname !== '/admin') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#123B52] text-white flex flex-col shrink-0">
        {/* Brand */}
        <div className="p-6 border-b border-[#287D91]/30">
          <Link to="/admin" className="flex flex-col">
            <span className="font-serif text-lg font-bold text-white tracking-tight">
              Sea View Admin
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#A9D6D5]">
              Mellieħa Operations Desk
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  active
                    ? 'bg-[#287D91] text-white font-semibold'
                    : 'text-[#FAF7F0]/80 hover:bg-[#287D91]/30 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="bg-[#E98268] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                    {item.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* User profile & actions */}
        <div className="p-4 border-t border-[#287D91]/30 space-y-3 bg-[#123B52]/50">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <span className="text-white font-medium block truncate">
                {staffUser?.name || 'Staff User'}
              </span>
              <span className="text-[10px] text-[#A9D6D5] capitalize">
                {staffUser?.role || 'Operator'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-red-300 hover:text-red-100 hover:bg-red-900/30 rounded transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-center gap-1.5 w-full py-2 bg-[#287D91]/30 hover:bg-[#287D91]/50 text-white rounded text-xs font-semibold transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Authenticated Staff Session · Mellieħa, Malta</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/orders"
              className="text-xs font-medium text-[#123B52] bg-[#FAF7F0] px-3 py-1.5 rounded border border-[#123B52]/20 hover:bg-[#123B52] hover:text-white transition-colors"
            >
              {pendingOrdersCount} Pending {pendingOrdersCount === 1 ? 'Order' : 'Orders'}
            </Link>
          </div>
        </header>

        <div className="p-6 md:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
};
