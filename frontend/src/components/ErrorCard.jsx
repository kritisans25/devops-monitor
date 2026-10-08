import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorCard({ title = 'Unable to load data', message, onRetry }) {
  return (
    <div className="ops-card p-5 border-[#FF6465]/40 bg-[#000000] text-center flex flex-col items-center justify-center min-h-[140px]">
      <div className="w-8 h-8 rounded-[6px] bg-[#000000] border border-[#FF6465]/40 flex items-center justify-center mb-2.5">
        <AlertTriangle className="w-4 h-4 text-[#FF6465]" />
      </div>
      <h3 className="text-xs font-semibold text-[#FF6465] mb-1 font-mono uppercase tracking-wider">{title}</h3>
      {message && (
        <p className="text-[11px] text-[#A1A4A5] font-mono max-w-md mb-3 break-words">
          {message}
        </p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-ghost inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs font-mono font-medium cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#9281F7]" />
          <span>Retry Connection</span>
        </button>
      )}
    </div>
  );
}

