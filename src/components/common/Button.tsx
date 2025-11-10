import React from 'react';
import clsx from 'classnames';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const base =
    'inline-flex items-center justify-center rounded-md px-4 h-14 min-w-[240px] text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2';
  const variants: Record<Required<ButtonProps>['variant'], string> = {
    primary:
      'bg-[#007bff] text-white hover:bg-[#0069d9] focus-visible:outline-[#007bff]',
    secondary:
      'bg-[#28a745] text-white hover:bg-[#218838] focus-visible:outline-[#28a745]',
    danger:
      'bg-[#dc3545] text-white hover:bg-[#c82333] focus-visible:outline-[#dc3545]',
    ghost:
      'bg-transparent text-[#343a40] hover:bg-[#f8f9fa] focus-visible:outline-[#9aa0a6] border border-[#dee2e6]',
    outline:
      'bg-white text-[#6c757d] hover:bg-[#f8f9fa] focus-visible:outline-[#9aa0a6] border-2 border-[#adb5bd] shadow-sm',
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
};


