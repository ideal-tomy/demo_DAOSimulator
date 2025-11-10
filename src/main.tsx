import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { DemoProvider } from './contexts/DemoContext';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DemoProvider>
  </StrictMode>
);
