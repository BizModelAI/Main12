import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function TestApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: 'blue' }}>🚀 React is Working!</h1>
      <p>This is a test to verify React is mounting properly.</p>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TestApp />
  </StrictMode>
);
