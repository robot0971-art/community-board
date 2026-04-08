import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-white/80 text-sm font-medium">{label}</label>
      )}
      <input
        className={`neon-input w-full ${error ? 'border-neon-red shake' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-neon-red text-sm">{error}</p>
      )}
    </div>
  );
}