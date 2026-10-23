import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ContactPage: React.FC = () => {
  const { settings, submitEnquiry } = useStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in your name, email address, and message.');
      return;
    }

    submitEnquiry({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim() || 'General Enquiry',
      message: message.trim(),
    });

    setSubmitted(true);
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Sea View Cafe/Bar · Get in Touch
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52]">
          Contact Us in Mellieħa
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Have an enquiry about terrace seating, dietary requirements, group lunches, or takeaway orders? Reach our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Contact Details & Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#123B52] border-b border-gray-100 pb-3">
              Direct Contact & Address
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#E98268] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-semibold">Address</strong>
                  <span>{settings.address}, {settings.locality}, Malta</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#E98268] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-semibold">Telephone</strong>
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="text-[#123B52] hover:text-[#287D91] font-bold text-base transition-colors"
                  >
                    {settings.phone}
                  </a>
                  <span className="text-[11px] text-gray-500 block mt-0.5">
                    Click to call directly from your device
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#287D91] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-semibold">Email</strong>
                  <a href={`mailto:${settings.email}`} className="text-[#123B52] hover:underline">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#287D91] shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-gray-900 font-semibold">Opening Hours (Malta Time)</strong>
                  <span>Monday – Thursday: 08:00 – 22:00</span>
                  <br />
                  <span>Friday – Saturday: 08:00 – 23:00</span>
                  <br />
                  <span>Sunday: 08:00 – 22:00</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-[#123B52] text-white rounded-2xl space-y-2">
            <h3 className="font-serif text-base font-bold text-white">
              Terrace Seating & Walk-ins
            </h3>
            <p className="text-xs text-[#FAF7F0]/85 leading-relaxed">
              We welcome walk-in guests on our seaside terrace throughout the day. For groups larger than 8 guests during weekend brunch hours, please call us by telephone in advance.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#123B52] border-b border-gray-100 pb-3">
            Send an Enquiry
          </h2>

          {submitted ? (
            <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif text-lg font-bold text-[#123B52]">Message Received</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Thank you for getting in touch. Your message has been sent to our café operations desk. We will respond via email or phone shortly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-2 text-xs font-semibold uppercase tracking-wider text-[#123B52] underline"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. David Schembri"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="david@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+356 7900 0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="e.g. Table reservation enquiry / dietary question"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-[#123B52]"
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
                className="w-full py-3 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
