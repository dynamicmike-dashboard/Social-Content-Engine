import { FlaskConical, Shield, Sparkles, ArrowRight } from 'lucide-react';

export function DemoBanner({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-yellow-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-xl">
              <FlaskConical size={20} className="text-yellow-700" />
            </div>
            <div>
              <p className="font-semibold text-yellow-900">Demo Mode Active</p>
              <p className="text-sm text-yellow-700">
                Viewing sample data • No account required • Changes not saved
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-4 text-sm text-yellow-700">
              <span className="flex items-center gap-1"><Shield size={14} /> No login needed</span>
              <span className="flex items-center gap-1"><Sparkles size={14} /> Full features</span>
              <span className="flex items-center gap-1">30 sample posts</span>
            </div>
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="px-4 py-2 bg-yellow-700 text-white rounded-lg font-medium hover:bg-yellow-800 transition-colors flex items-center gap-2 text-sm"
            >
              Try Live Version
              <ArrowRight size={16} />
            </button>
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="p-2 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100 rounded-lg transition-colors"
                aria-label="Dismiss demo banner"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}