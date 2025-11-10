import React from 'react';
import clsx from 'classnames';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={clsx(
        'bg-white rounded-2xl py-6 px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};


