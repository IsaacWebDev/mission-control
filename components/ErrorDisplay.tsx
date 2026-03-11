import { AlertCircle } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorDisplay({ 
  title = 'Failed to load data', 
  message, 
  onRetry,
  className = '' 
}: ErrorDisplayProps) {
  return (
    <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
      <div className="glass-card p-6 max-w-md w-full">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-red-400 text-lg font-semibold mb-2">
              {title}
            </h3>
            <p className="text-white/60 text-sm">
              {message}
            </p>
          </div>
        </div>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full glass-button px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}
