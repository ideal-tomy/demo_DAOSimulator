import React, { createContext, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type { ActivityLogItem, DemoState, Participant, Proposal, VoteChoice } from '../constants';
import { INITIAL_STATE, YEN } from '../constants';

type DemoContextValue = {
  state: DemoState;
  setPersona: (persona: DemoState['currentPersona']) => void;
  depositAndDistribute: (amount: number) => Promise<void>;
  castVote: (proposalId: string, choice: Exclude<VoteChoice, null>) => Promise<void>;
  resetDemo: () => void;
  getCurrentParticipant: () => Participant | null;
};

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DemoState>(INITIAL_STATE);

  const appendLog = (message: string) => {
    setState((prev) => {
      const item: ActivityLogItem = {
        id: `log-${Date.now()}`,
        timestamp: dayjs().toISOString(),
        message,
      };
      return { ...prev, activityLog: [item, ...prev.activityLog] };
    });
  };

  const setPersona = (persona: DemoState['currentPersona']) => {
    setState((prev) => ({ ...prev, currentPersona: persona }));
  };

  const depositAndDistribute = async (amount: number) => {
    // 入金→100msで開始→600ms以内に反映
    setState((prev) => ({
      ...prev,
      treasury: { balance: prev.treasury.balance + amount },
    }));
    await new Promise((r) => setTimeout(r, 100));

    setState((prev) => {
      const updatedParticipants = prev.participants.map((p) => {
        const share = Math.floor((amount * p.stakePercentage) / 100);
        return { ...p, walletBalance: p.walletBalance + share };
      });
      return { ...prev, participants: updatedParticipants };
    });

    appendLog(`【分配】共有金庫から各社へ ${YEN.format(amount)} を自動分配しました。`);
  };

  const castVote = async (proposalId: string, choice: Exclude<VoteChoice, null>) => {
    let participantName = '';
    let proposalTitle = '';
    setState((prev) => {
      const current = prev.currentPersona;
      if (current === 'LEGACY' || current === null) return prev;
      const participant = prev.participants.find((p) => p.id === current);
      participantName = participant?.name ?? '';
      const proposal = prev.proposals.find((p) => p.id === proposalId);
      proposalTitle = proposal?.title ?? proposalId;
      const proposals = prev.proposals.map((p) => {
        if (p.id !== proposalId) return p;
        const newVotes = p.votes.map((v) =>
          v.participantId === current ? { ...v, choice } : v
        );
        return { ...p, votes: newVotes };
      });
      return { ...prev, proposals };
    });

    // 150ms以内にグラフ更新扱い
    await new Promise((r) => setTimeout(r, 150));

    setState((prev) => {
      const proposals = prev.proposals.map((p) => {
        if (p.id !== proposalId) return p;
        const support = p.votes.reduce((acc, v) => (v.choice === 'support' ? acc + v.weight : acc), 0);
        const status: Proposal['status'] =
          support >= p.threshold ? 'passed' : p.status;
        return { ...p, status };
      });
      return { ...prev, proposals };
    });

    appendLog(
      `${participantName} が「${proposalTitle}」に${choice === 'support' ? '賛成' : '反対'}しました。`
    );
  };

  const resetDemo = () => {
    setState((prev) => {
      const resetState = { ...INITIAL_STATE, currentPersona: prev.currentPersona };
      // リセットログを初期ログに追加
      const resetLog: ActivityLogItem = {
        id: `log-reset-${Date.now()}`,
        timestamp: dayjs().toISOString(),
        message: 'デモをリセットしました。',
      };
      return {
        ...resetState,
        activityLog: [resetLog, ...resetState.activityLog],
      };
    });
  };

  const getCurrentParticipant = () => {
    if (!state.currentPersona || state.currentPersona === 'LEGACY') return null;
    return state.participants.find((p) => p.id === state.currentPersona) ?? null;
  };

  const value = useMemo<DemoContextValue>(
    () => ({
      state,
      setPersona,
      depositAndDistribute,
      castVote,
      resetDemo,
      getCurrentParticipant,
    }),
    [state]
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
};

export const useDemo = (): DemoContextValue => {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
};

