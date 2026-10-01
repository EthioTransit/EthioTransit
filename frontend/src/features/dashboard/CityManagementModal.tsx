import React, { useState } from 'react';
import { X, Building2, Check } from 'lucide-react';
import { citiesApi } from '../../api/endpoints';

interface CityManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCityCreated: () => void;
}

export const CityManagementModal: React.FC<CityManagementModalProps> = ({
  isOpen,
  onClose,
  onCityCreated,
}) => {
  const [name, setName] = useState('');
  const [amharicName, setAmharicName] = useState('');
  const [region, setRegion] = useState('');
  const [code, setCode] = useState('');
  const [terminalName, setTerminalName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !region.trim() || !code.trim()) {
      setError('Please fill in city name, region, and unique 3-letter code.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await citiesApi.create({
        name: name.trim(),
        amharicName: amharicName.trim() || undefined,
        region: region.trim(),
        code: code.trim().toUpperCase(),
        terminalName: terminalName.trim() || undefined,
        status: 'ACTIVE',
      });

      onCityCreated();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create city.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-cardLg shadow-2xl border border-gray-100 p-6 md:p-8 w-full max-w-lg animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-brand-emerald" />
            <h3 className="font-extrabold text-lg text-brand-dark">Add New Ethiopian City</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-btn bg-red-50 border border-red-200 text-status-error text-xs mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                City Name (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dessie"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Amharic Name
              </label>
              <input
                type="text"
                placeholder="e.g. ደሴ"
                value={amharicName}
                onChange={(e) => setAmharicName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald font-ethiopic"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                Region / State *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Amhara, Oromia, Tigray"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
                City Code (Unique) *
              </label>
              <input
                type="text"
                required
                maxLength={5}
                placeholder="e.g. DSS"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald uppercase font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase text-brand-textMuted mb-1">
              Primary Bus Terminal Name
            </label>
            <input
              type="text"
              placeholder="e.g. Menafesha Bus Terminal"
              value={terminalName}
              onChange={(e) => setTerminalName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-input border border-gray-200 focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-brand-textMuted hover:bg-gray-100 rounded-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-btn bg-brand-emerald hover:bg-brand-deep text-white font-extrabold text-sm shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? 'Saving...' : 'Add City'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
