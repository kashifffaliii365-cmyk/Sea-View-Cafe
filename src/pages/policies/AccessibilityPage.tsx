import React from 'react';
import { Eye, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AccessibilityPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Inclusivity & Access
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          Accessibility Statement
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Sea View Cafe/Bar · Physical & Digital Commitment
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">1. Physical Premises Access in Mellieħa</h2>
          <p>
            Sea View Cafe/Bar is committed to welcoming all guests. Our seaside terrace features step-free level entry from street access along Triq Salvinu Vella, allowing comfortable access for wheelchairs and baby strollers.
          </p>
          <p>
            Service dogs and guide animals are permitted on all outdoor terrace seating areas. If you require reserved accessible seating or table arrangements, our team will gladly assist upon arrival or via advance telephone notice at {settings.phone}.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">2. Digital Web Accessibility</h2>
          <p>
            We strive to adhere to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards across this website. Our digital implementation incorporates:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs">
            <li>High-contrast text styling designed for outdoor sunlight visibility.</li>
            <li>Accessible keyboard navigation and visible focus rings.</li>
            <li>Descriptive image alternative text for screen readers.</li>
            <li>Support for the <code>prefers-reduced-motion</code> user setting.</li>
            <li>Semantic HTML landmarks and form field associations.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">3. Feedback & Inquiries</h2>
          <p>
            If you encounter any difficulty navigating our website or accessing our physical café in Mellieħa, please contact us at {settings.phone} or via email at {settings.email}.
          </p>
        </section>
      </div>
    </div>
  );
};
