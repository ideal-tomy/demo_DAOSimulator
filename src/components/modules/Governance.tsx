import React from 'react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { useGovernance } from '../../hooks/useGovernance';
import { useDemo } from '../../contexts/DemoContext';
import { Pie, PieChart, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#28a745', '#dc3545'];

export const Governance: React.FC = () => {
  const { proposals, castVote, getSupportPercent } = useGovernance();
  const { state } = useDemo();
  const current = state.currentPersona;
  const isVoter = current && current !== 'LEGACY';

  const proposal = proposals[0];
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
      <div className="flex items-start gap-8">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-semibold">意思決定</h2>
            {proposal.status === 'voting' && <Badge color="blue">投票中</Badge>}
            {proposal.status === 'passed' && <Badge color="green">可決</Badge>}
            {proposal.status === 'rejected' && <Badge color="red">否決</Badge>}
          </div>
          <p className="text-sm text-[#6c757d] mt-2 mb-3">
            提案に対して、各社が議決権（出資比率）に応じた重み付けで投票できます。賛成が可決ラインを超えた瞬間、自動的に可決されます。
          </p>
          <p className="text-base text-[#343a40] font-medium mt-2">{proposal.title}</p>
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


