import React, { createContext, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import type { ActivityLogItem, DemoState, Participant, Proposal, VoteChoice } from '../constants';
import { INITIAL_STATE, YEN } from '../constants';

type DemoContextValue = {
  state: DemoState;
  setPersona: (persona: DemoState['currentPersona']) => void;
  depositAndDistribute: (amount: number) => Promise<void>;
  handleIncome: (amount: number) => Promise<void>;
  handleExpense: (amount: number) => Promise<void>;
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
      ui: { ...prev.ui, flowEvent: { id: Date.now(), type: 'income', amount } },
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

  const handleIncome = async (amount: number) => {
    await depositAndDistribute(amount);
  };

  const handleExpense = async (amount: number) => {
    // 金庫から支出 → 不足分は各社から按分で減額
    let deductedParticipants: Array<{ id: string; name: string; deduction: number }> = [];
    let treasuryPaid = 0;
    setState((prev) => {
      const remaining = prev.treasury.balance - amount;
      const deficit = remaining >= 0 ? 0 : Math.abs(remaining);
      const nextTreasury = Math.max(remaining, 0);
      treasuryPaid = Math.min(amount, prev.treasury.balance);
      const nextParticipants =
        deficit > 0
          ? prev.participants.map((p) => {
              const deduction = Math.floor((deficit * p.stakePercentage) / 100);
              if (deduction > 0) {
                deductedParticipants.push({ id: p.id, name: p.name, deduction });
              }
              return { ...p, walletBalance: Math.max(p.walletBalance - deduction, 0) };
            })
          : prev.participants;
      return {
        ...prev,
        treasury: { balance: nextTreasury },
        participants: nextParticipants,
        ui: { ...prev.ui, flowEvent: { id: Date.now(), type: 'expense', amount } },
      };
    });
    
    if (treasuryPaid > 0) {
      appendLog(`【支出】共有金庫から ${YEN.format(treasuryPaid)} を払い出しました。`);
    }
    if (deductedParticipants.length > 0) {
      deductedParticipants.forEach((p) => {
        appendLog(`${p.name} のウォレットから ${YEN.format(p.deduction)} が按分されました。`);
      });
    }
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

    let justPassed: { flag: boolean; type?: 'INCOME' | 'EXPENSE'; amount?: number; title?: string; id?: string } = {
      flag: false,
    };
    setState((prev) => {
      const proposals = prev.proposals.map((p) => {
        if (p.id !== proposalId) return p;
        const support = p.votes.reduce((acc, v) => (v.choice === 'support' ? acc + v.weight : acc), 0);
        const nextStatus: Proposal['status'] =
          support >= p.threshold ? 'passed' : p.status;
        if (p.status !== 'passed' && nextStatus === 'passed') {
          justPassed = { flag: true, type: p.type, amount: p.amount, title: p.title, id: p.id };
        }
        return { ...p, status: nextStatus };
      });
      return { ...prev, proposals };
    });

    appendLog(
      `${participantName} が「${proposalTitle}」に${choice === 'support' ? '賛成' : '反対'}しました。`
    );

    if (justPassed.flag) {
      const proposalIdNum = justPassed.id?.replace('proposal-', '') || '001';
      setState((prev) => ({
        ...prev,
        ui: {
          ...prev.ui,
          notification: {
            id: Date.now(),
            title: `契約#${proposalIdNum}は可決・自動執行されました。`,
            message: `${justPassed.title ?? '提案'} が成立しました。自動で処理を実行します。確定された内容が各社ダウンローと可能な共有フォルダにPDF保存されますので、確認してください。`,
          },
        },
      }));
      if (justPassed.type === 'EXPENSE' && justPassed.amount !== undefined) {
        await handleExpense(justPassed.amount);
      } else if (justPassed.type === 'INCOME' && justPassed.amount !== undefined) {
        await handleIncome(justPassed.amount);
      }
    }
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
      handleIncome,
      handleExpense,
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

