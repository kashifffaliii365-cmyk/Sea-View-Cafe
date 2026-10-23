import React from 'react';
import { MapPin, Phone, Compass, Bus, Car, ExternalLink, Navigation } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const FindUsPage: React.FC = () => {
  const { settings } = useStore();

  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    'Sea View Cafe/Bar Triq Salvinu Vella Il-Mellieħa Malta'
  )}`;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
          Directions & Location
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#123B52]">
          Find Us in Il-Mellieħa, Malta
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Sea View Cafe/Bar is located on Triq Salvinu Vella in Mellieħa, offering panoramic coastal views of the Mediterranean.
        </p>
      </div>

      {/* Main Map & Location Card */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm grid grid-cols-1 lg:grid-cols-3">
        {/* Left Col: Directions info */}
        <div className="p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#287D91]">
              Address & Coordinates
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#123B52]">
              Sea View Cafe/Bar
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-gray-700">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E98268] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-semibold">Physical Location</strong>
                  <span>{settings.address}, {settings.locality}, Malta</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#E98268] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-semibold">Telephone</strong>
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="text-[#123B52] hover:text-[#287D91] font-semibold"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#287D91] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-900 block font-semibold">GPS Coordinates</strong>
                  <span className="font-mono text-xs">
                    {settings.coordinates.lat.toFixed(4)}° N, {settings.coordinates.lng.toFixed(4)}° E
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-[#123B52] hover:bg-[#287D91] text-white font-semibold text-xs uppercase tracking-wider rounded-md transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Navigation className="w-4 h-4" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Right 2 Cols: Interactive Map Embed (or fallback map view) */}
        <div className="lg:col-span-2 relative min-h-[350px] bg-slate-100 border-t lg:border-t-0 lg:border-l border-gray-200">
          <iframe
            title="Sea View Cafe/Bar Mellieħa Map"
            src="https://maps.google.com/maps?q=Triq%20Salvinu%20Vella,%20Il-Mellieha,%20Malta&t=&z=15&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full min-h-[350px] border-0"
            loading="lazy"
            allowFullScreen
          />
        </div>
      </div>

      {/* Transport & Parking Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] text-[#123B52] flex items-center justify-center">
            <Car className="w-5 h-5 text-[#287D91]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#123B52]">
            By Car & Parking
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Mellieħa is easily reached via the main northern route (Route 1 / Triq il-Marfa). Street parking is available along Triq Salvinu Vella and adjoining public bays in Mellieħa.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] text-[#123B52] flex items-center justify-center">
            <Bus className="w-5 h-5 text-[#287D91]" />
          </div>
          <h3 className="font-serif text-lg font-bold text-[#123B52]">
            Public Transport (Malta Public Transport)
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Bus routes servicing Mellieħa include routes 41 & 42 (from Valletta), route 221 (from Buġibba / St Paul's Bay), and route 222 (from Sliema / St Julian's to Ċirkewwa). Alight at Mellieħa village stops.
          </p>
        </div>
      </div>
    </div>
  );
};
