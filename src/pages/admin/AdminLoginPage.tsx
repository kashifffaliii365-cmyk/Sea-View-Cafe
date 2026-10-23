import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, ArrowRight, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginStaff, isAuthenticated } = useStore();

  const [email, setEmail] = useState('staff@seaviewmalta.com');
  const [password, setPassword] = useState('Mellieha2026!');
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/admin';

  if (isAuthenticated) {
    navigate('/admin', { replace: true });
    return null;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const success = loginStaff(email, password);
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid staff credentials. Please check your email and password.');
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('staff@seaviewmalta.com');
    setPassword('Mellieha2026!');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="w-12 h-12 bg-[#123B52] text-white rounded-xl flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-6 h-6" />
        </div>
        <span className="text-xs uppercase tracking-widest font-semibold text-[#287D91]">
          Sea View Cafe/Bar · Mellieħa
        </span>
        <h1 className="font-serif text-3xl font-bold text-[#123B52]">Staff Management Portal</h1>
        <p className="text-xs text-gray-600">
          Sign in to manage incoming orders, kitchen menu items, pricing, and business settings.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200 sm:px-10 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Staff Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#123B52]"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#123B52]"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo helper */}
          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#123B52]/10 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-[#123B52] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Staff Credentials
              </span>
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="text-[11px] text-[#287D91] hover:underline font-semibold"
              >
                Auto Fill
              </button>
            </div>
            <p className="text-[11px] text-gray-600 font-mono">
              Email: staff@seaviewmalta.com
              <br />
              Pass: Mellieha2026!
            </p>
          </div>

          <div className="text-center pt-2">
            <Link to="/" className="text-xs text-gray-500 hover:text-[#123B52] transition-colors">
              ← Return to Public Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
