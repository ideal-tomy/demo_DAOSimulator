import React, { useRef } from 'react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useDemo } from '../../contexts/DemoContext';
import gsap from 'gsap';

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
    <Card>
      <h2 className="text-[22px] font-semibold mb-2">デモ操作パネル（プレゼン用）</h2>
      <p className="text-sm text-[#6c757d] mb-4">
        デモンストレーション用の操作パネルです。収益入金をシミュレートしたり、デモを初期状態にリセットできます。
      </p>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Button variant="secondary" onClick={handleDeposit} className="w-full sm:w-auto">
          （デモ用）海外配信収益 1,000万円 を金庫に入金
        </Button>
        <Button variant="ghost" onClick={resetDemo} className="w-full sm:w-auto">
          デモを初期化
        </Button>
      </div>
      <div ref={animRef} className="mt-3 text-[#28a745] text-sm font-medium opacity-0">
        自動分配を実行中…
      </div>
    </Card>
  );
};


