import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { TaskProvider } from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <TaskProvider>
        <App />
    </TaskProvider>
  </React.StrictMode>
);