import React, { useRef } from 'react';
import { Button } from '../common/Button';
import { useDemo } from '../../contexts/useDemo';
import gsap from 'gsap';
import clsx from 'classnames';

export const DemoPanel: React.FC = () => {
  const { depositAndDistribute, resetDemo } = useDemo();
  const animRef = useRef<HTMLDivElement>(null);

  const handleDeposit = async () => {
    if (animRef.current) {
      const el = animRef.current;
      gsap.fromTo(
        el,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.2, ease: 'power2.out' }
      );
      gsap.to(el, { opacity: 0, delay: 0.6, duration: 0.2 });
    }
    await depositAndDistribute(10_000_000);
  };

  return (
    <div
      className={clsx(
        'bg-gradient-to-br from-[#fff9e6] to-[#fff5d6] rounded-2xl border-2 border-dashed border-[#ffc107] py-6 px-6 sm:px-8 flex flex-col gap-4'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-[#ffc107]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
          <h2 className="text-[22px] font-semibold text-[#856404]">デモ操作パネル</h2>
        </div>
        <span className="hidden sm:inline-block bg-[#ffc107] text-[#856404] text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
          プレゼン用
        </span>
      </div>
      <span className="sm:hidden inline-block bg-[#ffc107] text-[#856404] text-xs font-bold px-3 py-1 rounded-full self-start">
        プレゼン用
      </span>
      <p className="text-sm text-[#856404] font-medium">
        デモンストレーション用の操作パネルです。収益入金をシミュレートしたり、デモを初期状態にリセットできます。
      </p>
      <div className="bg-white/60 rounded-lg p-3 border border-[#ffc107]/30">
        <p className="text-xs text-[#856404] font-medium leading-relaxed">
          💡 「海外配信収益 1,000万円を入金」ボタンを押すと、共有金庫に収益が入金され、自動的に各社のウォレットへ分配されます。
        </p>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button variant="secondary" onClick={handleDeposit} className="w-full sm:w-auto sm:min-w-[240px]">
          （デモ用）海外配信収益 1,000万円 を金庫に入金
        </Button>
        <Button variant="ghost" onClick={resetDemo} className="w-full sm:w-auto sm:min-w-[240px]">
          デモを初期化
        </Button>
      </div>
      <div ref={animRef} className="mt-1 text-[#28a745] text-sm font-medium opacity-0">
        自動分配を実行中…
      </div>
    </div>
  );
};


