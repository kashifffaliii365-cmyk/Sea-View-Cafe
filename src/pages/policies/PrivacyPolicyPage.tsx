import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const PrivacyPolicyPage: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Malta & EU GDPR Compliance
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52] mt-1">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500 mt-2">
          Effective Date: October 2026 · Data Controller: Sea View Cafe/Bar, Mellieħa, Malta
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">1. Overview & Data Controller</h2>
          <p>
            This Privacy Policy explains how Sea View Cafe/Bar ("we", "us", "our"), operating at Triq Salvinu Vella, Il-Mellieħa, Malta, collects, processes, and protects your personal data when you browse our website or submit an online order for collection or delivery.
          </p>
          <p>
            We process all customer personal data in strict compliance with Regulation (EU) 2016/679 (the General Data Protection Regulation or GDPR) and Chapter 586 of the Laws of Malta (Data Protection Act).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">2. Personal Data We Collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Order Data:</strong> Customer full name, email address, contact phone number, and order item details necessary to prepare and fulfill food and beverage orders.
            </li>
            <li>
              <strong>Delivery Data:</strong> If delivery is selected, street address, locality, postal code, and specific courier instructions.
            </li>
            <li>
              <strong>Enquiry Data:</strong> Information submitted voluntarily via our contact form (name, email, message).
            </li>
            <li>
              <strong>Technical & Cookie Data:</strong> Browser session identifiers, cart state, and optional analytics if consented.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">3. Legal Basis for Processing</h2>
          <p>
            We process personal data under Article 6 of the GDPR on the following grounds:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Contractual Necessity (Art. 6(1)(b)):</strong> To prepare, schedule, and complete your pickup or delivery order.
            </li>
            <li>
              <strong>Legal Obligation (Art. 6(1)(c)):</strong> To maintain VAT-compliant accounting records under Maltese fiscal legislation.
            </li>
            <li>
              <strong>Consent (Art. 6(1)(a)):</strong> For optional performance cookies and answering direct contact messages.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">4. Data Retention</h2>
          <p>
            Customer order records are retained only as long as necessary for transaction verification, dispute resolution, and statutory Maltese fiscal retention periods. Technical session data is cleared upon order completion or browser cache clearance.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">5. Your Rights as an EU Data Subject</h2>
          <p>
            Under Chapter III of the GDPR, you have the right to request access, rectification, erasure, restriction of processing, data portability, and the right to object to processing. You may also lodge a complaint with the Information and Data Protection Commissioner (IDPC) of Malta (idpc.org.mt).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-lg font-bold text-[#123B52]">6. Contact for Privacy Matters</h2>
          <p>
            To exercise your data privacy rights, please contact our data controller by email at{' '}
            <a href={`mailto:${settings.email}`} className="text-[#123B52] underline font-medium">
              {settings.email}
            </a>{' '}
            or by telephone at {settings.phone}.
          </p>
        </section>
      </div>
    </div>
  );
};
