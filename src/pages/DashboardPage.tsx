import React from 'react';
import { useDemo } from '../contexts/useDemo';
import { Treasury } from '../components/modules/Treasury';
import { Governance } from '../components/modules/Governance';
import { ActivityLog } from '../components/modules/ActivityLog';
import { DemoPanel } from '../components/modules/DemoPanel';
import { Button } from '../components/common/Button';
import { useNavigate } from 'react-router-dom';
import { PopupNotification } from '../components/common/PopupNotification';

export const DashboardPage: React.FC = () => {
  const { getCurrentParticipant, setPersona, state } = useDemo();
  const navigate = useNavigate();
  const current = getCurrentParticipant();

  const handleLogout = () => {
    setPersona(null);
    navigate('/');
  };

  const handleSwitchPersona = (id: string) => {
    setPersona(id);
  };

  return (
    <div className="w-full px-0 py-12">
      <header className="px-8 mb-16 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="w-full">
          <div className="text-sm text-[#6c757d]">ログイン中</div>
          <div className="text-[22px] font-semibold">
            {current ? `${current.name} (議決権 ${current.stakePercentage}%)` : '未選択'}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {state.participants.map((participant) => (
              <button
                key={participant.id}
                onClick={() => handleSwitchPersona(participant.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  state.currentPersona === participant.id
                    ? 'bg-[#007bff] border-[#007bff] text-white'
                    : 'bg-white border-[#dee2e6] text-[#6c757d] hover:border-[#007bff]'
                }`}
              >
                {participant.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <Button variant="ghost" onClick={() => navigate('/legacy')} className="min-w-0 w-full sm:w-auto">
            比較する（従来）
          </Button>
          <Button variant="ghost" onClick={handleLogout} className="min-w-0 w-full sm:w-auto">
            ログアウト
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 px-8">
        <Treasury />
        <Governance />
        <ActivityLog />
        <DemoPanel />
      </div>
      {state.ui.notification && (
        <PopupNotification
          title={state.ui.notification.title}
          message={state.ui.notification.message}
          durationMs={12000}
        />
      )}
    </div>
  );
};


