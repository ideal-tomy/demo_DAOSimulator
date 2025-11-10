import { useDemo } from '../contexts/DemoContext';

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


