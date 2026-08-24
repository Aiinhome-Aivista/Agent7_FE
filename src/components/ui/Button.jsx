import * as React from "react"
import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const variantStyles = {
  default:
    'bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] text-white shadow-[0_0_20px_rgba(var(--primary-orange-rgb),0.35)] hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(var(--primary-orange-rgb),0.5)] border-none',
  primary:
    'bg-[linear-gradient(135deg,var(--primary)_0%,var(--accent)_100%)] text-white shadow-[0_0_20px_rgba(var(--primary-orange-rgb),0.35)] hover:-translate-y-[2px] hover:shadow-[0_8px_30px_rgba(var(--primary-orange-rgb),0.5)] border-none !px-6 !py-3 !text-[0.95rem] !h-auto',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm',
  outline:
    'border border-border border-solid bg-transparent hover:bg-muted text-foreground shadow-sm',
  ghost: 'bg-transparent text-foreground hover:bg-muted',
  danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm',
  success: 'bg-green-500 text-white hover:bg-green-600 shadow-sm',
  link: 'text-primary underline-offset-4 hover:underline bg-transparent p-0 h-auto shadow-none',
};

const sizeStyles = {
  xs: 'h-7 px-2.5 text-xs gap-1.5',
  sm: 'h-8 px-3 text-sm gap-1.5',
  default: 'h-9 px-4 text-sm gap-2',
  lg: 'h-10 px-8 text-base gap-2',
  icon: 'h-9 w-9 p-0 items-center justify-center',
};

export const Button = forwardRef(function Button(
  {
    variant = 'default',
    size = 'default',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    className,
    disabled,
    children,
    asChild,
    ...rest
  },
  ref,
) {
  const isDisabled = disabled || isLoading;
  return (
    <button
      ref={ref}
      disabled={isDisabled}
      className={cn(
        // base
        'inline-flex items-center justify-center font-medium rounded-md whitespace-nowrap',
        'transition-colors duration-150 select-none',
        'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
      ) : (
        leftIcon && <span className="inline-flex shrink-0 mr-2">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0 ml-2">{rightIcon}</span>}
    </button>
  );
});

Button.displayName = "Button";
