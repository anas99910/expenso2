
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<GlassCardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-light-bg-secondary dark:bg-dark-bg-secondary backdrop-blur-[15px] border border-light-border-primary dark:border-dark-border-primary rounded-3xl transition-colors duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassCard;
