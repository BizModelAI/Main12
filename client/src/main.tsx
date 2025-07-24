import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

function SimpleApp() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1 style={{ color: '#333' }}>🎉 BizModelAI is Running!</h1>
      <p>React is working correctly. Now let's load your full app...</p>
      <button onClick={() => window.location.reload()} style={{ padding: '10px 20px', marginTop: '20px' }}>
        Reload
      </button>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SimpleApp />
  </StrictMode>
);
