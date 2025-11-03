
import React, { useEffect, useState } from 'react';

interface ToastProps {
  toast: { message: string; isError: boolean } | null;
}

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toast) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
      }, 2700); // A bit shorter than the timeout in App.tsx to allow fade-out
      return () => clearTimeout(timer);
    }
  }, [toast]);

  if (!toast) return null;

  const baseClasses = "fixed left-1/2 -translate-x-1/2 p-3 px-6 rounded-full font-medium transition-all duration-500 z-[100]";
  const positionClass = show ? 'bottom-8' : '-bottom-20';
  const colorClass = toast.isError
    ? 'bg-red-400 text-red-900'
    : 'bg-green-400 text-green-900';

  return (
    <div className={`${baseClasses} ${positionClass} ${colorClass}`}>
      {toast.message}
    </div>
  );
};

export default Toast;
