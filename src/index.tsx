import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Wallet } from './Wallet';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
    <React.StrictMode>
        <Wallet>
            <App />
        </Wallet>
    </React.StrictMode>
);
