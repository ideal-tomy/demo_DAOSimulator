import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { useDemo } from '../contexts/useDemo';

export const LegacyPage: React.FC = () => {
  const navigate = useNavigate();
  const { setPersona } = useDemo();
  const [pending, setPending] = useState<string | null>(null);

  const simulateDelay = async (action: string) => {
    setPending(action);
    await new Promise((r) => setTimeout(r, 3000));
    setPending(null);
    alert('確認が完了しました（暫定）。引き続き担当者の対応待ちです。');
  };

  const handleLogout = () => {
    setPersona(null);
    navigate('/');
  };

  return (
    <div className="w-full px-0 py-12">
      <header className="flex items-center justify-between mb-16 px-8">
        <div>
          <div className="text-sm text-[#6c757d]">ログイン中</div>
          <div className="text-[22px] font-semibold">幹事会社（事務局）</div>
        </div>
        <div className="flex gap-3">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="min-w-0">DAOを体験</Button>
          <Button variant="ghost" onClick={handleLogout} className="min-w-0">ログアウト</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-8">
        <Card>
          <h2 className="text-[22px] font-semibold mb-4">承認待ち一覧</h2>
          <ul className="space-y-3">
            <li className="flex items-center justify-between bg-[#f8f9fa] rounded px-3 py-2">
              <span>提案#001（北米ゲーム化）</span>
              <span className="text-[#dc3545] font-medium">B社 承認待ち</span>
            </li>
            <li className="flex items-center justify-between bg-[#f8f9fa] rounded px-3 py-2">
              <span>収益分配（10月分）</span>
              <span className="text-[#6c757d] font-medium">経理担当者 振込待ち</span>
            </li>
          </ul>
        </Card>
        <Card>
          <h2 className="text-[22px] font-semibold mb-4">手動操作</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => simulateDelay('approve')}>承認する</Button>
            <Button variant="danger" onClick={() => simulateDelay('reject')}>差し戻す</Button>
            <Button variant="ghost" disabled>分配を実行する</Button>
          </div>
          <p className="text-base text-[#6c757d] mt-3">
            操作後は担当者へのメール送信や確認作業などに時間を要します。
          </p>
        </Card>
      </div>

      <Modal open={!!pending} title="処理中">
        担当者にメール送信中…（約3秒）<br />
        この間、操作はロックされます。
      </Modal>
    </div>
  );
};


