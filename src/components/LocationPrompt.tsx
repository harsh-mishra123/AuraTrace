import { motion, AnimatePresence } from 'framer-motion';

interface LocationPromptProps {
  isOpen: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export default function LocationPrompt({ isOpen, onAllow, onDeny }: LocationPromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass-card rounded-lg p-4 max-w-sm"
        >
          <h3 className="text-sm font-medium text-text-primary mb-2">📍 Location Access</h3>
          <p className="text-xs text-text-secondary mb-4">
            AuraTrace uses your location to provide accurate local air quality data. 
            This helps us give you personalized health recommendations.
          </p>
          <div className="flex gap-2">
            <button
              onClick={onAllow}
              className="flex-1 px-3 py-2 bg-accent-hazard/20 text-accent-hazard rounded-md text-xs font-medium hover:bg-accent-hazard/30 transition-colors"
            >
              Allow
            </button>
            <button
              onClick={onDeny}
              className="flex-1 px-3 py-2 bg-white/5 text-text-secondary rounded-md text-xs font-medium hover:bg-white/10 transition-colors"
            >
              Not Now
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}