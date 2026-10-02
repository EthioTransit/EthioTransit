import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Bus, Calendar, Clock, MapPin, User, ShieldCheck, Download, Printer, CheckCircle } from 'lucide-react';
import { Ticket } from '../../types';
import { BRAND } from '../../config/brand';

interface DigitalTicketCardProps {
  ticket: Ticket;
  onPrint?: () => void;
}

export const DigitalTicketCard: React.FC<DigitalTicketCardProps> = ({ ticket, onPrint }) => {
  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const isUsed = ticket.status === 'USED';

  return (
    <div className="bg-white rounded-cardLg border border-gray-200 shadow-xl overflow-hidden max-w-xl mx-auto my-4 transition-all">
      {/* Top Emerald Header */}
      <div className="bg-gradient-to-r from-brand-deep to-brand-emerald p-6 text-white relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Bus className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight">{BRAND.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
              isUsed ? 'bg-amber-400 text-gray-900' : 'bg-white text-brand-emerald'
            }`}>
              {isUsed ? 'BOARDED' : 'CONFIRMED TICKET'}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <span className="text-xs uppercase tracking-wider text-emerald-100 font-semibold">
            {ticket.operatorName}
          </span>
          <h2 className="text-2xl font-black mt-0.5 tracking-tight">{ticket.routeTitle}</h2>
        </div>

        {/* Decorative corner cutout simulation */}
        <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-brand-bg border-r border-t border-gray-200" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 rounded-full bg-brand-bg border-l border-t border-gray-200" />
      </div>

      {/* Ticket Body */}
      <div className="p-6 md:p-8 flex flex-col gap-6">
        {/* Ticket Number & Vehicle */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4 border-b border-gray-100 text-xs">
          <div>
            <span className="text-brand-textLight font-semibold uppercase">Ticket No.</span>
            <p className="font-mono font-bold text-brand-textMain text-sm mt-0.5">
              {ticket.ticketNumber}
            </p>
          </div>
          <div>
            <span className="text-brand-textLight font-semibold uppercase">Seat</span>
            <p className="font-black text-brand-emerald text-base mt-0.5">
              {ticket.seatNumber}
            </p>
          </div>
          <div>
            <span className="text-brand-textLight font-semibold uppercase">Plate</span>
            <p className="font-semibold text-brand-textMain text-sm mt-0.5">
              {ticket.vehiclePlate || 'Assigned Bus'}
            </p>
          </div>
          <div>
            <span className="text-brand-textLight font-semibold uppercase">Fare Paid</span>
            <p className="font-bold text-brand-dark text-sm mt-0.5">
              {ticket.amountPaid} {BRAND.currency}
            </p>
          </div>
        </div>

        {/* Passenger & Date info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-brand-textLight font-semibold uppercase">Passenger</span>
              <p className="font-bold text-brand-textMain text-base">{ticket.passengerName}</p>
              <p className="text-xs text-brand-textMuted">{ticket.passengerPhone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-brand-emerald flex-shrink-0 mt-0.5" />
            <div>
              <span className="text-xs text-brand-textLight font-semibold uppercase">Departure</span>
              <p className="font-bold text-brand-textMain text-base">
                {ticket.departureDate} at {ticket.departureTime}
              </p>
              <p className="text-xs text-brand-textMuted">{ticket.pickupLocation}</p>
            </div>
          </div>
        </div>

        {/* QR Boarding Section (Requirement 37) */}
        <div className="bg-gray-50 rounded-card p-6 border border-gray-100 flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-white rounded-xl shadow-md border border-gray-100">
            {ticket.qrCodeDataUrl ? (
              <img
                src={ticket.qrCodeDataUrl}
                alt="Boarding QR Code"
                className="w-48 h-48 object-contain"
              />
            ) : (
              <QRCodeSVG
                value={ticket.qrVerificationToken}
                size={180}
                level="H"
                fgColor="#087443"
              />
            )}
          </div>

          <span className="text-xs font-mono font-bold text-brand-emerald tracking-wider mt-3">
            {ticket.qrVerificationToken}
          </span>
          <p className="text-xs text-brand-textMuted max-w-xs mt-1">
            Present this tamper-proof QR code to the driver upon boarding.
          </p>

          {isUsed && (
            <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
              <CheckCircle className="w-4 h-4" />
              <span>Already Boarded at {ticket.boardingTime ? new Date(ticket.boardingTime).toLocaleTimeString() : 'Trip'}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-brand-emerald" />
            <span>Official Government Verified Ticket</span>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-btn bg-gray-100 hover:bg-gray-200 text-brand-textMain text-xs font-bold transition-colors"
          >
            <Printer className="w-4 h-4 text-brand-emerald" />
            <span>Print Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
};
