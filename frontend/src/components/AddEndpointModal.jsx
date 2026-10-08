import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, AlertCircle, CheckCircle2, Globe, Sparkles } from 'lucide-react';
import { createMonitor, checkApi } from '../api/api';

export default function AddEndpointModal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setUrl('');
      setError(null);
      setSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    let trimmedUrl = url.trim();

    if (!trimmedName) {
      setError('Please provide a name for this endpoint');
      return;
    }

    if (!trimmedUrl) {
      setError('Please provide a valid URL');
      return;
    }

    if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
      trimmedUrl = 'https://' + trimmedUrl;
    }

    try {
      new URL(trimmedUrl);
    } catch {
      setError('Invalid URL format. Please enter a valid URL (e.g. https://api.example.com)');
      return;
    }

    try {
      setLoading(true);
      await createMonitor(trimmedName, trimmedUrl);
      
      try {
        await checkApi(trimmedUrl);
      } catch {
        // non-blocking
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 500);
    } catch (err) {
      console.error('Failed to create monitor:', err);
      setError(err.message || 'Failed to create monitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (presetName, presetUrl) => {
    setName(presetName);
    setUrl(presetUrl);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
      <div
        className="relative w-full max-w-md bg-[#000000] border border-[#292D30] rounded-[16px] shadow-none p-5 text-[#FFFFFF] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#292D30]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-[6px] bg-[#000000] border border-[#292D30] text-[#9281F7]">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#FFFFFF] tracking-tight">Add Monitored Endpoint</h2>
              <p className="text-[11px] text-[#A1A4A5]">Register target for automatic HTTP health checks</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1 rounded-[6px] text-[#A1A4A5] hover:text-[#FFFFFF] hover:bg-[#111419] transition-colors disabled:opacity-50 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-3.5 space-y-3">
          {error && (
            <div className="p-2 rounded-[6px] bg-[#000000] border border-[#FF6465]/60 text-xs text-[#FF6465] flex items-start space-x-2 font-mono">
              <AlertCircle className="w-4 h-4 text-[#FF6465] shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-2 rounded-[6px] bg-[#000000] border border-[#3AD389]/60 text-xs text-[#3AD389] flex items-start space-x-2 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#3AD389] shrink-0 mt-0.5" />
              <span>Endpoint registered successfully. Triggering initial check...</span>
            </div>
          )}

          {/* Quick presets */}
          <div>
            <div className="text-[10px] font-mono text-[#A1A4A5] uppercase tracking-wider mb-1.5 flex items-center gap-1 font-semibold">
              <Sparkles className="w-3 h-3 text-[#9281F7]" />
              <span>Quick Presets:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickFill('GitHub API', 'https://api.github.com')}
                className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#000000] hover:bg-[#0A0A0C] text-[#A1A4A5] hover:text-[#FFFFFF] border border-[#292D30] hover:border-[#4B5158] transition-colors cursor-pointer"
              >
                GitHub API
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('HTTPBin Test', 'https://httpbin.org/status/200')}
                className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#000000] hover:bg-[#0A0A0C] text-[#A1A4A5] hover:text-[#FFFFFF] border border-[#292D30] hover:border-[#4B5158] transition-colors cursor-pointer"
              >
                HTTPBin Test
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('Cloudflare DNS', 'https://1.1.1.1')}
                className="text-[11px] font-mono px-2 py-0.5 rounded-[4px] bg-[#000000] hover:bg-[#0A0A0C] text-[#A1A4A5] hover:text-[#FFFFFF] border border-[#292D30] hover:border-[#4B5158] transition-colors cursor-pointer"
              >
                Cloudflare
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A1A4A5] mb-1 font-mono">
              Endpoint Name
            </label>
            <input
              ref={inputRef}
              type="text"
              placeholder="e.g. Production Auth Service"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-1.5 bg-[#000000] border border-[#292D30] focus:border-[#9281F7] rounded-[6px] text-xs text-[#F0F0F0] placeholder-[#6E727A] focus:outline-hidden transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#A1A4A5] mb-1 font-mono">
              Target URL
            </label>
            <input
              type="text"
              placeholder="https://api.example.com/health"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-1.5 bg-[#000000] border border-[#292D30] focus:border-[#9281F7] rounded-[6px] text-xs text-[#F0F0F0] placeholder-[#6E727A] focus:outline-hidden transition-colors font-mono"
              required
            />
            <p className="text-[10px] text-[#6E727A] mt-1 font-mono">
              Periodic health checks run automatically every 30 seconds.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-[#292D30] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3 py-1 text-xs font-mono text-[#A1A4A5] hover:text-[#FFFFFF] rounded-[6px] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-ghost inline-flex items-center space-x-1 px-3 py-1 text-xs font-mono font-medium cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5 text-[#9281F7]" />
              <span>{loading ? 'Adding...' : 'Add Endpoint'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

