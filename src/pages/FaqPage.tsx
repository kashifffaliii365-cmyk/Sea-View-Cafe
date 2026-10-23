import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Phone } from 'lucide-react';
import { INITIAL_FAQS } from '../data/initialData';
import { useStore } from '../context/StoreContext';

export const FaqPage: React.FC = () => {
  const { settings } = useStore();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Customer Assistance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52]">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Helpful answers to common enquiries regarding visiting Sea View Cafe/Bar, our online ordering system, allergens, and terrace dining in Mellieħa.
        </p>
      </div>

      <div className="space-y-3">
        {INITIAL_FAQS.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#FAF7F0] transition-colors"
                aria-expanded={isOpen}
              >
                <span className="font-serif text-base font-bold text-[#123B52]">
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-[#287D91] shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-700 leading-relaxed border-t border-gray-100 bg-[#FAF7F0]/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Direct Contact Box */}
      <div className="p-6 bg-[#123B52] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-base font-bold text-white">
            Have a question not listed here?
          </h3>
          <p className="text-xs text-[#FAF7F0]/80 mt-1">
            Call our team directly at our Mellieħa premises during daily operating hours.
          </p>
        </div>
        <a
          href={`tel:${settings.phone.replace(/\s+/g, '')}`}
          className="px-5 py-2.5 bg-white text-[#123B52] hover:bg-[#FAF7F0] font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center gap-2 shrink-0"
        >
          <Phone className="w-3.5 h-3.5 text-[#E98268]" />
          <span>Call {settings.phone}</span>
        </a>
      </div>
    </div>
  );
};
