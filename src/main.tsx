import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './app/store';
import App from './App.tsx';
import './index.css';

async function enableMocking() {
  // if (import.meta.env.PROD) {
  //   return;
  // }

  const { worker } = await import('./mocks/browser');
  
  // Starting the worker
  return worker.start({
    onUnhandledRequest: 'bypass', 
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </StrictMode>,
  );
});
