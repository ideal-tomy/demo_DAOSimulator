import { createContext } from 'react';
import type { DemoState, Participant, VoteChoice } from '../constants';

export type DemoContextValue = {
  state: DemoState;
  setPersona: (persona: DemoState['currentPersona']) => void;
  depositAndDistribute: (amount: number) => Promise<void>;
  handleIncome: (amount: number) => Promise<void>;
  handleExpense: (amount: number) => Promise<void>;
  castVote: (proposalId: string, choice: Exclude<VoteChoice, null>) => Promise<void>;
  resetDemo: () => void;
  getCurrentParticipant: () => Participant | null;
};

export const DemoContext = createContext<DemoContextValue | undefined>(undefined);


