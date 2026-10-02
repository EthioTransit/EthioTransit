import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Printer, Download, CheckCircle, Bus } from 'lucide-react';
import { ticketsApi } from '../api/endpoints';
import { DigitalTicketCard } from '../features/tickets/DigitalTicketCard';
import { Ticket } from '../types';

export const TicketPage: React.FC = () => {
  const { ticketId } = useParams<{ ticketId: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticketId) return;

    const fetchTicket = async () => {
      setLoading(true);
      try {
        const data = await ticketsApi.getById(ticketId);
        setTicket(data);
      } catch (err: any) {
        setError(err.message || 'Ticket not found.');
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-emerald border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-brand-textMain">Loading digital ticket...</span>
        </div>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen bg-brand-bg p-8 text-center">
        <p className="text-red-600 font-bold">{error || 'Ticket not found.'}</p>
        <Link to="/" className="mt-4 inline-block text-brand-emerald font-semibold">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-brand-bg min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to="/my-tickets"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-emerald hover:text-brand-deep transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>My Digital Tickets</span>
          </Link>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-white border border-gray-200 text-xs font-bold text-brand-textMain hover:bg-gray-50 shadow-xs"
          >
            <Printer className="w-4 h-4 text-brand-emerald" />
            <span>Print Boarding Pass</span>
          </button>
        </div>

        <DigitalTicketCard ticket={ticket} onPrint={() => window.print()} />
      </div>
    </div>
  );
};
