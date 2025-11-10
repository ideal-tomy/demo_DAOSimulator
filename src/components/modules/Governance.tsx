import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useGovernance } from '../../hooks/useGovernance';
import { useDemo } from '../../contexts/DemoContext';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';
import { YEN } from '../../constants';

const COLORS = ['#28a745', '#dc3545'];

export const Governance: React.FC = () => {
  const { proposals, castVote, getSupportPercent } = useGovernance();
  const { state } = useDemo();
  const current = state.currentPersona;
  const isVoter = current && current !== 'LEGACY';

  // 投票中の提案を優先表示、なければ最初の提案
  const proposal = proposals.find((p) => p.status === 'voting') || proposals[0];
  const support = getSupportPercent(proposal);
  const data = [
    { name: '賛成', value: Math.round(support) },
    { name: '反対/未投票', value: Math.max(0, 100 - Math.round(support)) },
  ];
  const currentVote = proposal.votes.find((v) => v.participantId === current);
  const alreadyVoted =
    isVoter &&
    currentVote &&
    currentVote.choice !== null;

  return (
    <Card>
      <div className="relative flex items-start gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold">意思決定</h2>
            {proposal.status === 'voting' && <Badge color="blue">投票中</Badge>}
            {proposal.status === 'rejected' && <Badge color="red">否決</Badge>}
          </div>
          <p className="text-sm text-[#6c757d] mt-2 mb-3">
            提案に対して、各社が議決権（出資比率）に応じた重み付けで投票できます。賛成が可決ラインを超えた瞬間、自動的に可決されます。
          </p>
          <p className="text-base text-[#343a40] font-medium mt-2">{proposal.title}</p>
          {proposal.type === 'EXPENSE' && proposal.amount && (
            <div className="mt-3 text-base text-[#dc3545] font-semibold">
              支出額: {YEN.format(proposal.amount)}
            </div>
          )}
          <div className="mt-4 text-base">
            可決ライン: <span className="font-semibold">{proposal.threshold}%</span>
          </div>
          {alreadyVoted && (
            <div className="mt-3 text-sm text-[#28a745] font-medium">
              あなたは既に「{currentVote?.choice === 'support' ? '賛成' : '反対'}」に投票済みです。
            </div>
          )}
          <div className="mt-4 flex gap-3">
            <button
              className="rounded-md bg-[#28a745] text-white px-4 h-14 min-w-[120px] text-base disabled:opacity-50 transition-colors"
              disabled={!isVoter || alreadyVoted || proposal.status !== 'voting'}
              onClick={() => castVote(proposal.id, 'support')}
            >
              賛成する
            </button>
            <button
              className="rounded-md bg-[#dc3545] text-white px-4 h-14 min-w-[120px] text-base disabled:opacity-50 transition-colors"
              disabled={!isVoter || alreadyVoted || proposal.status !== 'voting'}
              onClick={() => castVote(proposal.id, 'against')}
            >
              反対する
            </button>
          </div>
          {proposal.status === 'passed' && (
            <div className="mt-6 flex items-center justify-center">
              <div className="relative bg-[#dc3545] text-white px-8 py-4 rounded-lg text-xl font-bold shadow-lg filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.2)]">
                <svg className="absolute inset-0 w-full h-full opacity-30">
                  <filter id="noise">
                    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" />
                    <feColorMatrix type="saturate" values="0" />
                  </filter>
                  <rect width="100%" height="100%" filter="url(#noise)" />
                </svg>
                <span className="relative z-10">可決</span>
              </div>
            </div>
          )}
        </div>
        <div className="w-[280px] h-[200px] min-w-[280px] min-h-[200px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 text-sm space-y-1">
            <div>
              現在の賛成率: <span className="font-semibold">{support.toFixed(1)}%</span>
            </div>
            <div className="text-xs text-[#6c757d]">
              {proposal.votes
                .filter((v) => v.choice === 'support')
                .map((v) => {
                  const p = state.participants.find((p) => p.id === v.participantId);
                  return `${p?.name ?? v.participantId} (${v.weight}%)`;
                })
                .join(', ') || 'まだ投票がありません'}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};


