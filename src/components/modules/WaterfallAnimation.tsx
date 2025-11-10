import React, { useEffect, useMemo, useState, useRef } from 'react';

type Props = {
  triggerId?: number;
  type?: 'income' | 'expense';
  durationMs?: number;
  participantCount?: number;
};

// Bezierパスを使用した滝/支出アニメーション
export const WaterfallAnimation: React.FC<Props> = ({
  triggerId,
  type = 'income',
  durationMs = 800,
  participantCount = 15,
}) => {
  const [show, setShow] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!triggerId) return;
    setShow(true);
    const t = setTimeout(() => setShow(false), durationMs);
    return () => clearTimeout(t);
  }, [triggerId, durationMs]);

  // 各社へのBezierパスを生成（簡易版：中央から各方向へ）
  const paths = useMemo(() => {
    const centerX = 50; // 中央（%）
    const centerY = 10; // 上部（%）
    const paths: Array<{ path: string; delay: number }> = [];
    
    // 15社分のパスを生成（円形に配置）
    for (let i = 0; i < participantCount; i++) {
      const angle = (i / participantCount) * 2 * Math.PI;
      const radius = 30 + (i % 3) * 10; // 3段階の半径
      const endX = centerX + radius * Math.cos(angle);
      const endY = centerY + radius * Math.sin(angle) + 40;
      
      // Bezier曲線の制御点
      const cp1X = centerX + (endX - centerX) * 0.3;
      const cp1Y = centerY + 15;
      const cp2X = centerX + (endX - centerX) * 0.7;
      const cp2Y = endY - 15;
      
      const path = `M ${centerX} ${centerY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${endX} ${endY}`;
      paths.push({ path, delay: i * 0.05 });
    }
    
    return paths;
  }, [participantCount]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      <div className="absolute left-1/2 top-4 -translate-x-1/2 text-xs font-medium text-[#6c757d] bg-white/80 px-2 py-1 rounded">
        {type === 'income' ? '自動分配を実行中…' : '支出を実行中…'}
      </div>
      <svg ref={svgRef} className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {paths.map(({ path, delay }, i) => (
          <g key={i}>
            <path
              d={path}
              fill="none"
              stroke={type === 'income' ? '#28a745' : '#dc3545'}
              strokeWidth="0.3"
              strokeDasharray="0.5 0.5"
              opacity="0.3"
            />
            <circle
              cx="50"
              cy="10"
              r="1.5"
              fill={type === 'income' ? '#28a745' : '#dc3545'}
              opacity="0"
            >
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur={`${durationMs}ms`}
                begin={`${delay * 1000}ms`}
                fill="freeze"
              />
              <animateMotion
                dur={`${durationMs * 0.8}ms`}
                begin={`${delay * 1000}ms`}
                fill="freeze"
              >
                <mpath href={`#path-${i}`} />
              </animateMotion>
            </circle>
            <path
              id={`path-${i}`}
              d={path}
              fill="none"
              visibility="hidden"
            />
          </g>
        ))}
      </svg>
    </div>
  );
};


