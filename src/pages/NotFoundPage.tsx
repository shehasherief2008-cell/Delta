import React from 'react';
import { Link } from '../lib/router';
import { HeartHandshake, ArrowLeft, Home, Search } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-sand-border/70 flex items-center justify-center text-forest mx-auto">
        <HeartHandshake className="w-8 h-8 text-primary" />
      </div>

      <div className="space-y-2">
        <span className="text-4xl font-extrabold text-forest">404</span>
        <h1 className="text-2xl font-bold text-forest">Page Not Found</h1>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          The requested page or listing could not be found. It may have moved or been retired.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <Link
          to="/"
          className="px-4 py-2.5 bg-forest text-mint text-xs font-bold rounded-xl flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/donations"
          className="px-4 py-2.5 bg-sand-subtle text-forest text-xs font-bold rounded-xl border border-sand-border flex items-center gap-1.5"
        >
          <Search className="w-4 h-4 text-primary" />
          <span>Explore Donations</span>
        </Link>
      </div>
    </div>
  );
};

