import { useDemo } from '../contexts/DemoContext';

export const useDemoState = () => {
  const { state, setPersona, resetDemo } = useDemo();
  return { state, setPersona, resetDemo };
};


