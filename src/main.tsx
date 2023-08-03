import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App.tsx';
import { toggleTransport } from './audio-engine/transport.ts';
import { store } from './store.ts';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App onStartClick={toggleTransport} />
    </Provider>
  </React.StrictMode>,
);