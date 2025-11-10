import React from 'react';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { useDemo } from '../contexts/DemoContext';
import { useNavigate } from 'react-router-dom';

const IntroGuide: React.FC = () => {
  return (
    <Card className="mt-16">
      <h2 className="text-[22px] font-semibold mb-2">このデモで体験できること</h2>
      <ol className="list-decimal list-inside text-base text-[#495057] space-y-2">
        <li>役割を選ぶ</li>
        <li>自動分配（収益の滝）を体験する</li>
        <li>オンライン投票で可決を体験する</li>
        <li>従来フロー（レガシー）と比較する</li>
      </ol>
    </Card>
  );
};

export const LoginPage: React.FC = () => {
  const { state, setPersona } = useDemo();
  const navigate = useNavigate();

  const handleSelect = (id: string) => {
    setPersona(id);
    navigate('/dashboard');
  };
  const handleLegacy = () => {
    setPersona('LEGACY');
    navigate('/legacy');
  };

  return (
    <div className="w-full px-0 py-12">
      <h1 className="text-[28px] font-semibold text-center">製作委員会DAO シミュレーター</h1>
      <p className="text-base text-[#6c757d] mt-2 text-center">
        「収益の滝」と「高速な合意形成」を、シンプルなUIで体験できます。
      </p>
      <Card className="mt-16">
        <h2 className="text-[22px] font-semibold mb-4">ログインする役割を選択</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {state.participants.map((participant) => (
            <Button
              key={participant.id}
              variant="outline"
              onClick={() => handleSelect(participant.id)}
              className="w-full min-w-0 justify-between text-sm"
            >
              <span className="truncate">{participant.name}</span>
              <span className="ml-2 text-[#6c757d] font-medium whitespace-nowrap">
                {participant.stakePercentage}%
              </span>
            </Button>
          ))}
          <Button variant="outline" onClick={handleLegacy} className="bg-white w-full min-w-0">
            （比較用）従来の幹事会社としてログイン
          </Button>
        </div>
      </Card>
      <IntroGuide />
    </div>
  );
};


