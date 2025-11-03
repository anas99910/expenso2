
import React from 'react';

type GlassInputProps = React.InputHTMLAttributes<HTMLInputElement>;

const GlassInput: React.FC<GlassInputProps> = (props) => {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={`bg-light-bg-tertiary dark:bg-dark-bg-tertiary border border-light-border-primary dark:border-dark-border-primary text-light-text-primary dark:text-dark-text-primary 
                 placeholder-light-text-tertiary dark:placeholder-dark-text-tertiary 
                 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/30
                 transition-colors duration-300 w-full rounded-lg p-3 ${className}`}
    />
  );
};

export default GlassInput;
