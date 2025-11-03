
import React from 'react';
import GlassCard from '../shared/GlassCard';

interface ModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      ></div>
      <GlassCard className="z-10 w-full max-w-md p-6 animate-slide-in-up">
        <h3 className="text-2xl font-semibold text-light-text-primary dark:text-dark-text-primary mb-6">{title}</h3>
        {children}
      </GlassCard>
    </div>
  );
};

export default ModalWrapper;
