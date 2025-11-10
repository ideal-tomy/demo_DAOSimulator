import { useDemo } from '../contexts/useDemo';

export const useDemoState = () => {
  const { state, setPersona, resetDemo } = useDemo();
  return { state, setPersona, resetDemo };
};


