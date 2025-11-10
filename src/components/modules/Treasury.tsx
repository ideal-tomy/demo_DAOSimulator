import React from 'react';
import { Card } from '../common/Card';
import { useTreasury } from '../../hooks/useTreasury';
import { YEN } from '../../constants';
import { WaterfallAnimation } from './WaterfallAnimation';
import { AnimatedNumber } from '../common/AnimatedNumber';
import { useDemo } from '../../contexts/useDemo';

export const Treasury: React.FC = () => {
  const { treasury, currentParticipant, participants } = useTreasury();
  const selfBalance = currentParticipant?.walletBalance ?? 0;
  const { state } = useDemo();

  return (
    <Card>
      <div className="relative">
        <WaterfallAnimation
          triggerId={state.ui.flowEvent?.id}
          type={state.ui.flowEvent?.type}
          participantCount={participants.length}
        />
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-[22px] font-semibold mb-2">共有金庫</h2>
            <p className="text-sm text-[#6c757d] mb-3">
              プロジェクト全体の収益を管理する共有金庫です。収益が入金されると、出資比率に応じて自動的に各社のウォレットへ分配されます。
            </p>
            <div className="text-3xl font-bold text-[#007bff]">
              <AnimatedNumber value={treasury.balance} formatter={(n) => YEN.format(n)} />
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-[#6c757d] mb-1">自社ウォレット残高</h3>
            <div className="text-2xl font-semibold">
              <AnimatedNumber value={selfBalance} formatter={(n) => YEN.format(n)} />
            </div>
          </div>
          <div className="text-sm text-[#6c757d]">
            出資比率:
            <ul className="mt-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {participants.map((p) => (
                <li key={p.id} className="flex items-center justify-between bg-[#f8f9fa] rounded px-3 py-2 text-xs md:text-sm">
                  <span className="truncate pr-2">{p.name}</span>
                  <span className="font-medium whitespace-nowrap">{p.stakePercentage}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
};


