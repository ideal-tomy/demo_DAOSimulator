import React, { useEffect, useState } from 'react';
import clsx from 'classnames';

type PopupNotificationProps = {
  title: string;
  message: string;
  onClose?: () => void;
  durationMs?: number;
};

export const PopupNotification: React.FC<PopupNotificationProps> = ({
  title,
  message,
  onClose,
  durationMs = 12000,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    const hideTimer = setTimeout(() => setVisible(false), durationMs);
    const closeTimer = setTimeout(() => onClose?.(), durationMs + 300);
    return () => {
      clearTimeout(hideTimer);
      clearTimeout(closeTimer);
    };
  }, [durationMs, onClose]);

  return (
    <div
      className={clsx(
        'fixed right-6 top-6 z-50 w-[360px] max-w-[90vw] rounded-lg border border-[#e9ecef] bg-white p-4 transition-transform duration-300 ease-out',
        visible ? 'translate-x-0' : 'translate-x-[120%]'
      )}
      role="status"
      aria-live="polite"
    >
      <div className="text-sm font-semibold mb-1 text-[#198754]">{title}</div>
      <div className="text-sm text-[#495057]">{message}</div>
    </div>
  );
};


