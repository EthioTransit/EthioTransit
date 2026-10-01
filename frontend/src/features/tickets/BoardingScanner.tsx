import React, { useState } from 'react';
import { QrCode, CheckCircle2, AlertOctagon, XCircle, Search, UserCheck } from 'lucide-react';
import { boardingApi } from '../../api/endpoints';

interface BoardingScannerProps {
  tripId?: string;
  onSuccessVerification?: (data: any) => void;
}

export const BoardingScanner: React.FC<BoardingScannerProps> = ({ tripId, onSuccessVerification }) => {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    status: 'VALID_TICKET' | 'ALREADY_USED' | 'INVALID_TICKET' | null;
    message: string;
    passenger?: any;
    ticket?: any;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await boardingApi.verify({
        token: tokenInput.trim(),
        tripId,
        verificationDevice: 'Driver Mobile Scanner / Web Terminal',
      });

      setResult({
        status: res.code as any,
        message: res.message,
        passenger: res.passenger,
        ticket: res.ticket,
      });

      if (res.code === 'VALID_TICKET' && onSuccessVerification) {
        onSuccessVerification(res);
      }
    } catch (err: any) {
      const code = err.code || 'INVALID_TICKET';
      setResult({
        status: code === 'ALREADY_USED' ? 'ALREADY_USED' : 'INVALID_TICKET',
        message: err.message || 'Ticket verification failed.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-card p-6 md:p-8 border border-gray-100 shadow-card flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-brand-emerald flex items-center justify-center">
          <QrCode className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-extrabold text-lg text-brand-dark">Ticket Boarding Verification</h3>
          <p className="text-xs text-brand-textMuted">
            Scan passenger QR code token or enter the ticket number to verify boarding.
          </p>
        </div>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            id="ticket-token-input"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="e.g. ETH-VERIFY-... or TK-2026-..."
            className="w-full pl-10 pr-4 py-2.5 rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald text-sm font-mono"
          />
        </div>
        <button
          type="submit"
          id="verify-ticket-submit-btn"
          disabled={loading || !tokenInput.trim()}
          className="px-6 py-2.5 rounded-btn bg-brand-emerald hover:bg-brand-deep disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          {loading ? 'Verifying...' : 'Verify & Board'}
        </button>
      </form>

      {/* Verification Result Display */}
      {result && (
        <div
          className={`p-6 rounded-card border animate-in zoom-in-95 duration-150 ${
            result.status === 'VALID_TICKET'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : result.status === 'ALREADY_USED'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-red-50 border-red-200 text-red-900'
          }`}
        >
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-0.5">
              {result.status === 'VALID_TICKET' && (
                <CheckCircle2 className="w-8 h-8 text-status-success" />
              )}
              {result.status === 'ALREADY_USED' && (
                <AlertOctagon className="w-8 h-8 text-amber-600" />
              )}
              {result.status === 'INVALID_TICKET' && (
                <XCircle className="w-8 h-8 text-status-error" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                    result.status === 'VALID_TICKET'
                      ? 'bg-status-success text-white'
                      : result.status === 'ALREADY_USED'
                      ? 'bg-amber-500 text-white'
                      : 'bg-status-error text-white'
                  }`}
                >
                  {result.status}
                </span>
                <span className="text-sm font-bold">{result.message}</span>
              </div>

              {result.passenger && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-black/10 text-xs">
                  <div>
                    <span className="text-black/60 font-semibold uppercase">Passenger</span>
                    <p className="font-extrabold text-sm mt-0.5">{result.passenger.name}</p>
                  </div>
                  <div>
                    <span className="text-black/60 font-semibold uppercase">Seat Number</span>
                    <p className="font-black text-base mt-0.5">{result.passenger.seatNumber}</p>
                  </div>
                  <div>
                    <span className="text-black/60 font-semibold uppercase">Phone</span>
                    <p className="font-semibold text-sm mt-0.5">{result.passenger.phone}</p>
                  </div>
                  <div>
                    <span className="text-black/60 font-semibold uppercase">Route</span>
                    <p className="font-semibold text-sm mt-0.5">{result.passenger.route}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
