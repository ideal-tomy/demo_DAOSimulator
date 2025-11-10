import React, { useEffect, useRef, useState } from 'react';

type AnimatedNumberProps = {
  value: number;
  durationMs?: number;
  formatter?: (n: number) => string;
  className?: string;
};

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  durationMs = 400,
  formatter = (n) => n.toLocaleString('ja-JP'),
  className,
}) => {
  const [display, setDisplay] = useState(value);
  const startRef = useRef<number>(value);
  const fromRef = useRef<number>(value);
  const startAtRef = useRef<number>(0);

  useEffect(() => {
    fromRef.current = display;
    startRef.current = value;
    startAtRef.current = performance.now();
    const tick = (now: number) => {
      const elapsed = now - startAtRef.current;
      const t = Math.min(1, elapsed / durationMs);
      // ease-out
      const eased = 1 - Math.pow(1 - t, 2);
      const next = Math.round(fromRef.current + (startRef.current - fromRef.current) * eased);
      setDisplay(next);
      if (t < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span className={className}>{formatter(display)}</span>;
};


