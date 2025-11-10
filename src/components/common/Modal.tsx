import React from 'react';
import clsx from 'classnames';

type ModalProps = {
  open: boolean;
  title?: string;
  children?: React.ReactNode;
};

export const Modal: React.FC<ModalProps> = ({ open, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div
        className={clsx(
          'relative bg-white rounded-lg shadow-lg border border-[#e9ecef] w-[480px] max-w-[90vw] p-6'
        )}
      >
        {title ? <h3 className="text-lg font-semibold mb-4">{title}</h3> : null}
        <div className="text-sm">{children}</div>
      </div>
    </div>
  );
};


