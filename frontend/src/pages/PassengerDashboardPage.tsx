import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket as TicketIcon, Calendar, Clock, MapPin, User, ShieldCheck, ArrowRight, Bus } from 'lucide-react';
import { ticketsApi, bookingsApi } from '../api/endpoints';
import { useAuth } from '../features/auth/useAuth';
import { Ticket, Booking } from '../types';
import { BRAND } from '../config/brand';

export const PassengerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPassengerData = async () => {
      setLoading(true);
      try {
        const [ticketsData, bookingsData] = await Promise.all([
          ticketsApi.getMyTickets().catch(() => []),
          bookingsApi.getMyBookings().catch(() => []),
        ]);
        setTickets(ticketsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error('Failed to load passenger data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPassengerData();
  }, []);

  const upcomingTicket = tickets.find((t) => t.status === 'ISSUED');

  return (
    <div className="bg-brand-bg min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-brand-emerald uppercase tracking-wider">
              <span>Passenger Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-brand-dark tracking-tight mt-0.5">
              Welcome, {user?.firstName || 'Traveler'}!
            </h1>
            <p className="text-xs text-brand-textMuted mt-1">
              Manage your digital boarding passes and active Ethiopian transit bookings.
            </p>
          </div>

          <Link
            to="/search"
            className="px-5 py-2.5 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white text-xs font-bold shadow-md transition-all flex items-center gap-2 w-fit"
          >
            <span>Book New Trip</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Highlight: Next Upcoming Journey */}
        {upcomingTicket && (
          <div className="bg-gradient-to-r from-brand-deep to-brand-emerald rounded-cardLg p-6 sm:p-8 text-white shadow-xl mb-10 relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/20 w-fit">
                  Upcoming Trip • Ready for Boarding
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {upcomingTicket.routeTitle}
                </h2>
                <div className="flex flex-wrap items-center gap-4 text-xs text-emerald-100 font-semibold mt-1">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {upcomingTicket.departureDate} at {upcomingTicket.departureTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" />
                    {upcomingTicket.pickupLocation}
                  </span>
                  <span>Seat: {upcomingTicket.seatNumber}</span>
                </div>
              </div>

              <Link
                to={`/tickets/${upcomingTicket._id}`}
                className="px-6 py-3.5 rounded-btn bg-white text-brand-emerald hover:bg-gray-50 font-black text-sm shadow-md transition-all text-center flex-shrink-0"
              >
                Open QR Boarding Pass
              </Link>
            </div>
          </div>
        )}

        {/* Digital Tickets Grid */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-extrabold text-lg text-brand-dark">My Digital Tickets</h3>
            <span className="text-xs font-semibold text-brand-textMuted">{tickets.length} total</span>
          </div>

          {tickets.length === 0 ? (
            <div className="p-10 text-center bg-white rounded-card border border-gray-100">
              <TicketIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-500">No tickets found.</p>
              <Link to="/search" className="text-xs font-bold text-brand-emerald hover:underline mt-2 inline-block">
                Search and book your first journey →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tickets.map((t) => (
                <div
                  key={t._id}
                  className="bg-white rounded-card p-6 border border-gray-100 shadow-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
                      <span className="font-mono text-xs font-bold text-brand-emerald">
                        {t.ticketNumber}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === 'USED'
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-emerald-50 text-status-success'
                        }`}
                      >
                        {t.status === 'USED' ? 'BOARDED' : 'CONFIRMED'}
                      </span>
                    </div>

                    <h4 className="font-black text-base text-brand-dark">{t.routeTitle}</h4>
                    <p className="text-xs text-brand-textMuted mt-1">
                      {t.departureDate} at {t.departureTime}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-100 text-xs">
                      <div>
                        <span className="text-brand-textLight">Passenger:</span>
                        <p className="font-bold text-brand-textMain">{t.passengerName}</p>
                      </div>
                      <div>
                        <span className="text-brand-textLight">Seat:</span>
                        <p className="font-black text-brand-emerald">{t.seatNumber}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/tickets/${t._id}`}
                    className="mt-6 w-full py-2.5 rounded-btn bg-gray-50 hover:bg-emerald-50 text-brand-emerald font-bold text-xs text-center border border-gray-200 hover:border-emerald-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Boarding QR</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking History Table */}
        <div className="bg-white rounded-card border border-gray-100 shadow-card p-6">
          <h3 className="font-extrabold text-lg text-brand-dark mb-4">Past Bookings</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-brand-textMuted uppercase font-bold border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Seats</th>
                  <th className="py-3 px-4">Total Paid</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-brand-dark">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-brand-textMain">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-brand-emerald">
                      {b.seats.join(', ')}
                    </td>
                    <td className="py-3.5 px-4 font-black text-brand-dark">
                      {b.total} {BRAND.currency}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-status-success">
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
