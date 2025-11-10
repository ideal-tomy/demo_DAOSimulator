import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'
import App from './App.tsx'
import { DemoProvider } from './contexts/DemoContext'
import { BrowserRouter } from 'react-router-dom'

const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoProvider>
      <BrowserRouter basename={basename || undefined}>
        <App />
      </BrowserRouter>
    </DemoProvider>
  </StrictMode>,
)
