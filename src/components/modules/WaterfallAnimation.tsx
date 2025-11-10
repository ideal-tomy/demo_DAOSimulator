import React, { useEffect, useMemo, useState } from 'react';
import clsx from 'classnames';

type Props = {
  triggerId?: number;
  type?: 'income' | 'expense';
  durationMs?: number;
};

// 簡易版の滝/支出アニメーション（SVG＋CSS キーフレーム）
export const WaterfallAnimation: React.FC<Props> = ({
  triggerId,
  type = 'income',
  durationMs = 800,
}) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (!triggerId) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
  }, [triggerId, durationMs]);

  const balls = useMemo(() => Array.from({ length: 8 }), []);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-medium text-[#6c757d]">
        {type === 'income' ? '自動分配を実行中…' : '支出を実行中…'}
      </div>
      <svg className="absolute inset-0 w-full h-full">
        {balls.map((_, i) => (
          <circle
            key={i}
            cx={50 + i * 10}
            cy={-10}
            r={5}
            className={clsx(
              type === 'income' ? 'fill-[#28a745]' : 'fill-[#dc3545]'
            )}
          >
            <animate
              attributeName="cy"
              from="-10"
              to="300"
              dur={`${0.6 + i * 0.05}s`}
              begin="0s"
              fill="freeze"
            />
            <animate
              attributeName="cx"
              from={`${60 + i * 8}`}
              to={`${40 + i * 12}`}
              dur={`${0.6 + i * 0.05}s`}
              begin="0s"
              fill="freeze"
            />
          </circle>
        ))}
      </svg>
    </div>
  );
};


