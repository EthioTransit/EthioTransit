import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  QrCode,
  CreditCard,
  Clock,
  ArrowRight,
  Bus,
  CheckCircle2,
  Users,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { SearchCard } from '../features/search/SearchCard';
import { routesApi } from '../api/endpoints';
import { BRAND } from '../config/brand';
import { Route } from '../types';

export const HomePage: React.FC = () => {
  const { t } = useTranslation(['common', 'navigation', 'search']);
  const [popularRoutes, setPopularRoutes] = useState<Route[]>([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const routes = await routesApi.getPopular();
        setPopularRoutes(routes);
      } catch (err) {
        console.error('Failed to load popular routes:', err);
      } finally {
        setLoadingRoutes(false);
      }
    };
    fetchRoutes();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION (Requirement 14 & 15) */}
      <section className="relative bg-gradient-to-b from-brand-bg via-white to-brand-bg pt-12 pb-20 overflow-hidden">
        {/* Subtle Ethiopian patterned background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-emerald-100/40 via-amber-50/30 to-emerald-50/40 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-brand-emerald text-xs font-extrabold uppercase tracking-wider mb-4 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Modern Ethiopian Intercity Transportation</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-brand-dark tracking-tight leading-[1.15]">
              Travel Across Ethiopia, <span className="text-brand-emerald">Smarter.</span>
            </h1>

            <p className="mt-4 text-base sm:text-lg text-brand-textMuted leading-relaxed max-w-2xl mx-auto">
              Search routes, compare trips, choose your seat, pay securely, and travel with a verified digital ticket.
            </p>

            <div className="flex items-center justify-center gap-4 mt-6">
              <a
                href="#search-section"
                className="px-6 py-3 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white font-bold text-sm shadow-md shadow-brand-emerald/20 transition-all"
              >
                Search Trips
              </a>
              <Link
                to="/routes"
                className="px-6 py-3 rounded-btn bg-white hover:bg-gray-50 border border-gray-200 text-brand-textMain font-bold text-sm shadow-xs transition-all"
              >
                Explore Routes
              </Link>
            </div>
          </div>

          {/* SEARCH CARD (Directly below hero headline - Requirement 15 & 16) */}
          <div id="search-section" className="mt-6 max-w-5xl mx-auto">
            <SearchCard />
          </div>
        </div>
      </section>

      {/* POPULAR ROUTES SECTION (Requirement 28 - Dynamically from backend) */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-brand-emerald">
                Top Destinations
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-brand-dark mt-1">
                Popular Intercity Routes
              </h2>
            </div>
            <Link
              to="/routes"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-emerald hover:text-brand-deep mt-2 sm:mt-0 transition-colors"
            >
              <span>View All Routes</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularRoutes.slice(0, 6).map((route) => {
              const originName = route.origin?.name || 'Origin';
              const destName = route.destination?.name || 'Destination';
              const todayIso = new Date().toISOString().split('T')[0];

              return (
                <Link
                  key={route._id}
                  to={`/search?from=${route.origin?.code}&to=${route.destination?.code}&date=${todayIso}&passengers=1`}
                  className="bg-brand-bg rounded-card p-6 border border-gray-200/80 hover:border-brand-emerald hover:shadow-cardHover transition-all duration-200 group flex flex-col justify-between"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-brand-textLight">Direct Route</span>
                      <h3 className="text-lg font-black text-brand-dark mt-1 group-hover:text-brand-emerald transition-colors">
                        {originName} → {destName}
                      </h3>
                    </div>
                    <div className="w-9 h-9 rounded-full bg-white shadow-xs flex items-center justify-center text-brand-emerald group-hover:bg-brand-emerald group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200/60 flex items-center justify-between text-xs text-brand-textMuted">
                    <span>{route.distanceKm} km</span>
                    <span>~{route.estimatedDurationHours} hours</span>
                    <span className="font-bold text-brand-emerald">Available Daily</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (Requirement 29) */}
      <section className="py-20 bg-brand-bg border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-emerald">
              Seamless Passenger Experience
            </span>
            <h2 className="text-3xl font-black text-brand-dark mt-1">
              How EthioTransit Works
            </h2>
            <p className="text-sm text-brand-textMuted mt-2">
              Four easy steps from search to boarding your bus with an official digital ticket.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Search',
                desc: 'Find your intercity route, destination, and travel date with real-time seat availability.',
                icon: MapPin,
              },
              {
                step: '02',
                title: 'Choose',
                desc: 'Compare licensed operators, scheduled departure times, bus amenities, and select your seat map position.',
                icon: Bus,
              },
              {
                step: '03',
                title: 'Pay',
                desc: 'Pay the official government-regulated fare securely through Telebirr, CBE Birr, or instant payment.',
                icon: CreditCard,
              },
              {
                step: '04',
                title: 'Travel',
                desc: 'Show your digital ticket with tamper-proof QR code to the driver upon boarding and enjoy your trip.',
                icon: QrCode,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-card p-8 border border-gray-100 shadow-card flex flex-col relative"
                >
                  <span className="text-3xl font-black text-emerald-100 mb-4">{item.step}</span>
                  <div className="w-12 h-12 rounded-btn bg-emerald-50 text-brand-emerald flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black text-brand-dark mb-2">{item.title}</h3>
                  <p className="text-sm text-brand-textMuted leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PAYMENT TRANSPARENCY & OFFICIAL FARE BANNER (Requirement 33) */}
      <section className="py-16 bg-brand-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-emerald/20 text-emerald-300 text-xs font-bold w-fit">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Payment Transparency Guarantee</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                No Hidden Surcharges. No Unofficial Ticket Prices.
              </h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Ethiopian travelers often face fluctuating fares and unofficial collections. EthioTransit locks the official government-regulated fare upfront. Drivers and bus conductors cannot manually modify the fare or solicit extra charges.
              </p>
              <div className="flex flex-col gap-2 mt-2 text-sm text-gray-300">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                  <span>Exact official fare breakdown before you pay</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                  <span>Verified server-side financial transaction records</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-brand-emerald" />
                  <span>Direct integration with Telebirr and Ethiopian banking</span>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-cardLg p-8 border border-white/10 flex flex-col gap-6">
              <span className="text-xs uppercase font-extrabold tracking-wider text-brand-gold">
                Demonstration Price Transparency
              </span>
              <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
                <span className="text-gray-300">Addis Ababa → Debre Berhan (130 km)</span>
                <span className="font-bold text-white">250 ETB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
                <span className="text-gray-300">Addis Ababa → Bahir Dar (565 km)</span>
                <span className="font-bold text-white">1,250 ETB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-white/10 text-sm">
                <span className="text-gray-300">Platform Technology Fee</span>
                <span className="font-bold text-brand-gold">15 ETB</span>
              </div>
              <div className="p-4 rounded-btn bg-brand-emerald/20 border border-brand-emerald/40 text-xs text-emerald-200">
                Official fare is established in partnership with certified transport associations and Ministry standards.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED OPERATORS */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-textLight">
            Official Transportation Partners
          </span>
          <h2 className="text-2xl font-black text-brand-dark mt-1 mb-8">
            Authorized Intercity Operators
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-center max-w-4xl mx-auto">
            {['Selam Bus Line S.C.', 'Sky Bus Transport', 'Oda Bus Transport S.C.', 'Golden Bus Express'].map(
              (name, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-card bg-gray-50 border border-gray-100 font-bold text-sm text-brand-textMain text-center hover:bg-emerald-50/50 hover:border-brand-emerald transition-all"
                >
                  <Bus className="w-6 h-6 text-brand-emerald mx-auto mb-2" />
                  <span>{name}</span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
