'use client';

import { useEffect, useState } from 'react';
import { Download, FileText, Lock, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function CvPreviewPage() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'subscription_required' | 'error'>('loading');
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    let objectUrl: string | null = null;

    async function loadCv() {
      setStatus('loading');
      try {
        const res = await fetch('/api/cv/generate', { cache: 'no-store' });
        if (res.status === 403) {
          const data = await res.json().catch(() => ({}));
          if (data?.code === 'SUBSCRIPTION_REQUIRED') {
            setStatus('subscription_required');
            return;
          }
        }
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setErrorMessage(data?.error || 'Failed to generate your CV.');
          setStatus('error');
          return;
        }
        const blob = await res.blob();
        objectUrl = URL.createObjectURL(blob);
        setPdfUrl(objectUrl);
        setStatus('ready');
      } catch (err) {
        setErrorMessage('Failed to generate your CV. Please try again.');
        setStatus('error');
      }
    }

    loadCv();

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, []);

  return (
    <div className="max-w-full max-w-[1000px] mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tighter">My <span className="text-[#b50a0a]">CV</span></h1>
          <p className="text-gray-900 text-xs font-bold tracking-wide mt-1">Preview and download your profile as an ATS-formatted CV.</p>
        </div>
        {status === 'ready' && pdfUrl && (
          <a
            href={pdfUrl}
            download="CenterKick-Profile-CV.pdf"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#b50a0a] hover:bg-red-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md"
          >
            <Download className="w-4 h-4" /> Download CV
          </a>
        )}
      </div>

      {status === 'loading' && (
        <div className="pt-10 pb-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-100 border-t-[#b50a0a] rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500 uppercase tracking-widest animate-pulse">Generating your CV...</p>
        </div>
      )}

      {status === 'subscription_required' && (
        <div className="p-10 bg-amber-50 border border-amber-100 rounded-[32px] text-center space-y-4">
          <Lock className="w-10 h-10 text-amber-600 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">An active subscription is required</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">CV export is a membership feature. Subscribe to unlock a downloadable, ATS-formatted CV built from your profile.</p>
          <Link
            href="/dashboard/subscription"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md"
          >
            View Subscription Plans
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div className="p-10 bg-red-50 border border-red-100 rounded-[32px] text-center space-y-4">
          <FileText className="w-10 h-10 text-red-500 mx-auto" />
          <h2 className="text-lg font-bold text-gray-900">Couldn't generate your CV</h2>
          <p className="text-sm text-gray-600 max-w-md mx-auto">{errorMessage}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        </div>
      )}

      {status === 'ready' && pdfUrl && (
        <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
          <iframe src={pdfUrl} title="CV Preview" className="w-full h-[80vh]" />
        </div>
      )}
    </div>
  );
}
