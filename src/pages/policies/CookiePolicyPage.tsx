import React from 'react';
import { Cookie, Settings2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CookiePolicyPage: React.FC = () => {
  const { cookiePreferences, saveCookieConsent } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Privacy & Tracking Transparency
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          Cookie Policy
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Effective Date: October 2026 · Sea View Cafe/Bar, Mellieħa, Malta
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">1. What Are Cookies?</h2>
          <p>
            Cookies are small text files stored on your computer or mobile device when you load websites. They allow our digital ordering system to recognise your device, maintain items in your shopping bag, and remember your display preferences.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">2. Categories of Cookies We Use</h2>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
            <h3 className="font-semibold text-gray-900">A. Strictly Necessary Cookies (Always Active)</h3>
            <p className="text-xs text-gray-600">
              Required for basic website functionality, user session security, preserving your cart contents during navigation, and processing checkout requests. Without these, online ordering cannot operate.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
            <h3 className="font-semibold text-gray-900">B. Performance & Analytics Cookies (Optional)</h3>
            <p className="text-xs text-gray-600">
              Collect aggregated, anonymized metrics on page traffic and menu interaction speeds to help us optimize server responsiveness. We only activate these with your explicit affirmative consent.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-1.5">
            <h3 className="font-semibold text-gray-900">C. Functionality & Marketing Cookies (Optional)</h3>
            <p className="text-xs text-gray-600">
              Used to enable external map previews and third-party social media embed integrations. Disabled by default unless approved by you.
            </p>
          </div>
        </section>

        <section className="space-y-3 pt-4 border-t border-gray-100">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">3. Your Current Preferences on This Browser</h2>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• Strictly Necessary Cookies: <strong>Enabled (Required)</strong></p>
            <p>• Performance & Analytics: <strong>{cookiePreferences.analytics ? 'Enabled' : 'Disabled'}</strong></p>
            <p>• Marketing & Embeds: <strong>{cookiePreferences.marketing ? 'Enabled' : 'Disabled'}</strong></p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                localStorage.removeItem('seaview_cookies_consent');
                window.location.reload();
              }}
              className="px-4 py-2 bg-[#123B52] hover:bg-[#287D91] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Re-open Cookie Consent Prompt
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
