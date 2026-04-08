import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseStyle = 'rounded-lg font-semibold cursor-pointer transition-all duration-300';
  
  const variants = {
    primary: 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-neon-pink hover:shadow-neon-blue hover:-translate-y-0.5',
    secondary: 'glass-card text-white hover:border-neon-blue/50',
    danger: 'bg-gradient-to-r from-neon-red to-neon-pink text-white shadow-lg',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}