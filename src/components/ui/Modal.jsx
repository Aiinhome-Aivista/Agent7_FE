import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, className = '' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative z-50 w-full max-w-lg overflow-hidden rounded-[var(--radius-lg)] bg-card border border-border shadow-xl ${className}`}
          >
            {title && (
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose} className="rounded-full p-1 hover:bg-hover transition-colors">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
            )}
            {!title && (
              <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-1 hover:bg-hover transition-colors">
                <X size={20} className="text-muted-foreground" />
              </button>
            )}
            <div className="p-6">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export { Modal };
