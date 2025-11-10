import { useDemo } from '../contexts/useDemo';
import type { Proposal } from '../constants';

export const useGovernance = () => {
  const { state, castVote } = useDemo();

  const getProposal = (id: string): Proposal | undefined =>
    state.proposals.find((p) => p.id === id);

  const getSupportPercent = (proposal: Proposal): number => {
    const total = proposal.votes.reduce((acc, v) => acc + v.weight, 0);
    const support = proposal.votes.reduce(
      (acc, v) => (v.choice === 'support' ? acc + v.weight : acc),
      0
    );
    return total > 0 ? (support / total) * 100 : 0;
  };

  return {
    proposals: state.proposals,
    castVote,
    getProposal,
    getSupportPercent,
  };
};


