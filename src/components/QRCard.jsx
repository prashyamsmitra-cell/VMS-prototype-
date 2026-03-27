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
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      showToast('Failed to copy link', 'error');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-300 shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col items-center gap-4">
        <h3 className="text-lg font-semibold text-slate-900 text-center">{location.name}</h3>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-red-400 transition-colors">
          <QRCode value={qrValue} size={200} level="H" includeMargin={true} />
        </div>

        <button
          onClick={handleCopyLink}
          className={`w-full px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
            isCopied
              ? 'bg-green-500 text-white'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isCopied ? '✓ Link Copied' : 'Copy Link'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          Scan QR code or share the link for visitor check-in
        </p>
      </div>
    </div>
  );
}
