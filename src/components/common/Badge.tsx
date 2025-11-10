import React from 'react';
import clsx from 'classnames';

type BadgeProps = {
  children: React.ReactNode;
  color?: 'gray' | 'green' | 'red' | 'blue';
  className?: string;
};

export const Badge: React.FC<BadgeProps> = ({ children, color = 'gray', className }) => {
  const styles: Record<NonNullable<BadgeProps['color']>, string> = {
    gray: 'bg-[#f1f3f5] text-[#343a40]',
    green: 'bg-[#d4edda] text-[#155724]',
    red: 'bg-[#f8d7da] text-[#721c24]',
    blue: 'bg-[#cfe2ff] text-[#084298]',
  };
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        styles[color],
        className
      )}
    >
      {children}
    </span>
  );
};


