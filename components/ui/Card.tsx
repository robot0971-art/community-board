import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  neonBorder?: 'pink' | 'purple' | 'blue';
}

export default function Card({
  hover = true,
  neonBorder,
  className = '',
  children,
  ...props
}: CardProps) {
  const baseStyle = 'glass-card p-6';
  const hoverStyle = hover ? 'hover:border-neon-blue/30 hover:shadow-neon-blue/15' : '';
  const borderStyle = neonBorder ? `neon-border-${neonBorder}` : '';

  return (
    <div
      className={`${baseStyle} ${hoverStyle} ${borderStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}