import React from 'react';
import { Card } from '../common/Card';
import { useDemo } from '../../contexts/useDemo';

export const ActivityLog: React.FC = () => {
  const { state } = useDemo();
  const items = state.activityLog;
  return (
    <Card>
      <h2 className="text-[22px] font-semibold mb-2">活動ログ</h2>
      <p className="text-sm text-[#6c757d] mb-4">
        すべての操作（収益分配、投票など）が自動的に記録されます。改ざん不可能な履歴として、全参加者が共有できます。
      </p>
      <ul className="space-y-2 max-h-[260px] overflow-auto pr-2">
        {items.map((log) => (
          <li
            key={log.id}
            className="bg-[#f8f9fa] rounded px-3 py-2 text-base border border-[#e9ecef]"
          >
            <div className="text-sm text-[#6c757d]">{new Date(log.timestamp).toLocaleString('ja-JP', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '')}</div>
            <div className="font-medium">{log.message}</div>
          </li>
        ))}
      </ul>
      <p className="text-sm text-[#6c757d] mt-3">※編集・削除不可（追記のみ）</p>
    </Card>
  );
};


