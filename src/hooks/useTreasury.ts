import { useDemo } from '../contexts/useDemo';

export const useTreasury = () => {
  const { state, depositAndDistribute, getCurrentParticipant } = useDemo();
  const { treasury, participants } = state;

  const currentParticipant = getCurrentParticipant();

  return {
    treasury,
    participants,
    currentParticipant,
    depositAndDistribute,
  };
};


