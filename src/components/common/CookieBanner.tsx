import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Settings2, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const CookieBanner: React.FC = () => {
  const { cookieConsentGiven, cookiePreferences, saveCookieConsent } = useStore();
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [analytics, setAnalytics] = useState(cookiePreferences.analytics);
  const [marketing, setMarketing] = useState(cookiePreferences.marketing);

  if (cookieConsentGiven && !showPreferencesModal) {
    return null;
  }

  const handleAcceptAll = () => {
    saveCookieConsent({
      essential: true,
      analytics: true,
      marketing: true,
    });
    setShowPreferencesModal(false);
  };

  const handleRejectOptional = () => {
    saveCookieConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });
    setShowPreferencesModal(false);
  };

  const handleSavePreferences = () => {
    saveCookieConsent({
      essential: true,
      analytics,
      marketing,
    });
    setShowPreferencesModal(false);
  };

  return (
    <>
      {/* Banner */}
      {!cookieConsentGiven && (
        <div
          role="region"
          aria-label="Cookie consent banner"
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 bg-white/95 backdrop-blur-md border-t border-[#123B52]/15 shadow-2xl"
        >
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-3xl">
              <div className="flex items-center gap-2 text-[#123B52] font-semibold text-sm">
                <ShieldCheck className="w-4 h-4 text-[#287D91]" />
                <span>Cookie & Privacy Preferences (EU / Malta)</span>
              </div>
              <p className="text-xs text-[#202B32]/80 leading-relaxed">
                We use strictly necessary cookies to run our online ordering system, retain your cart, and secure your session. Optional analytics help us understand menu usage. You can accept all or customize your preferences anytime.{' '}
                <Link to="/cookie-policy" className="underline text-[#287D91] hover:text-[#123B52]">
                  Read Cookie Policy
                </Link>
                .
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(true)}
                className="px-3.5 py-2 text-xs font-medium text-[#123B52] border border-[#123B52]/20 hover:bg-[#FAF7F0] rounded-md transition-colors flex items-center gap-1.5"
              >
                <Settings2 className="w-3.5 h-3.5" />
                Customize
              </button>
              <button
                type="button"
                onClick={handleRejectOptional}
                className="px-3.5 py-2 text-xs font-medium text-[#202B32] bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Essential Only
              </button>
              <button
                type="button"
                onClick={handleAcceptAll}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#123B52] hover:bg-[#287D91] rounded-md transition-colors shadow-sm"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preferences Modal */}
      {showPreferencesModal && (
        <div className="fixed inset-0 z-50 bg-[#123B52]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowPreferencesModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-[#123B52] mb-2">
              Manage Cookie Settings
            </h3>
            <p className="text-xs text-gray-600 mb-6">
              Adjust which cookies you permit Sea View Cafe/Bar to store during your visit in accordance with EU GDPR regulations.
            </p>

            <div className="space-y-4">
              {/* Essential */}
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-900 flex items-center gap-2">
                    Strictly Necessary Cookies
                    <span className="text-[10px] text-gray-500 font-normal">(Required)</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Enables cart storage, checkout security, and site navigation. Cannot be disabled.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="mt-1 h-4 w-4 text-[#123B52] rounded border-gray-300"
                />
              </div>

              {/* Analytics */}
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-900">Performance & Analytics</div>
                  <p className="text-xs text-gray-600 mt-1">
                    Helps us aggregate page visit statistics to improve menu loading times and discoverability.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="cookie-analytics"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#123B52] rounded border-gray-300 focus:ring-[#287D91]"
                />
              </div>

              {/* Marketing */}
              <div className="p-3 bg-gray-50 rounded-md border border-gray-200 flex items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-semibold text-gray-900">Marketing & Social Embeds</div>
                  <p className="text-xs text-gray-600 mt-1">
                    Enables interactive map embeds and social media content previews.
                  </p>
                </div>
                <input
                  type="checkbox"
                  id="cookie-marketing"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="mt-1 h-4 w-4 text-[#123B52] rounded border-gray-300 focus:ring-[#287D91]"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowPreferencesModal(false)}
                className="px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePreferences}
                className="px-5 py-2 text-xs font-semibold text-white bg-[#123B52] hover:bg-[#287D91] rounded-md transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
