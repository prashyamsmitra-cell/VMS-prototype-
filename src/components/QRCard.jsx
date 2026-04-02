import { useState } from 'react';
import QRCode from 'react-qr-code';
import { useToast } from '../context/ToastContext';

export default function QRCard({ location }) {
  const [isCopied, setIsCopied] = useState(false);
  const { showToast } = useToast();

  const publicAppUrl = (import.meta.env.VITE_PUBLIC_APP_URL || window.location.origin).replace(/\/$/, '');
  const qrValue = `${publicAppUrl}/location/${encodeURIComponent(location.id)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setIsCopied(true);
      showToast('Link copied to clipboard!', 'success');
      setTimeout(() => setIsCopied(false), 2500);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="card-base card-hover p-6 sm:p-8 relative overflow-hidden group">
      {/* Accent Bar */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-500 to-red-600 opacity-60 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 text-center group-hover:text-red-600 transition-colors duration-250">
          {location.name}
        </h3>

        {/* QR Code Container */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200 group-hover:border-red-300 transition-all duration-300 shadow-sm group-hover:shadow-md">
          <div className="flex justify-center">
            <QRCode value={qrValue} size={200} level="H" includeMargin={true} />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCopyLink}
          className={`w-full px-4 py-3 rounded-lg font-bold transition-all duration-250 flex items-center justify-center gap-2 ${
            isCopied
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:scale-95'
          }`}
        >
          {isCopied ? (
            <>
              <span>✓</span>
              Link Copied!
            </>
          ) : (
            <>
              <span>📋</span>
              Copy Link
            </>
          )}
        </button>

        {/* Helper Text */}
        <p className="text-xs text-slate-500 text-center leading-relaxed">
          Scan the QR code or share the link below for visitor check-in
        </p>

        {/* Link Display */}
        <div className="w-full bg-gray-50 rounded-lg p-3 border border-gray-200 overflow-hidden">
          <p className="text-xs text-slate-600 font-mono break-all text-center">
            {qrValue}
          </p>
        </div>
      </div>
    </div>
  );
}
