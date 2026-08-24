import React from 'react';

const Badge = React.forwardRef(({ className = '', variant = 'default', children, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none';
  
  const variants = {
    default: 'bg-hover text-foreground',
    primary: 'bg-primary-orange text-white',
    success: 'bg-[rgba(16,185,129,0.15)] text-success border border-[rgba(16,185,129,0.3)]',
    warning: 'bg-[rgba(245,158,11,0.15)] text-warning border border-[rgba(245,158,11,0.3)]',
    danger: 'bg-[rgba(239,68,68,0.15)] text-danger border border-[rgba(239,68,68,0.3)]',
    info: 'bg-[rgba(59,130,246,0.15)] text-blue-400 border border-[rgba(59,130,246,0.3)]',
    outline: 'text-foreground border border-border',
  };

  return (
    <div ref={ref} className={`${baseClasses} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
});

Badge.displayName = 'Badge';
export { Badge };
