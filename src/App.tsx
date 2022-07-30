import React, { useState, useEffect } from 'react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
import { initVestingClient } from './client/init';
import { Wallet } from '@project-serum/anchor';
import { VestingClient } from './client/tokenVesting.client';

function App() {
    const wallet = useAnchorWallet();
    const [client, setClient] = useState<VestingClient | null>(null);

    useEffect(() => {
        (async () => {
            if (wallet) {
                try {
                    const vestingClient = await initVestingClient(wallet as Wallet);
                    setClient(vestingClient);
                } catch (err) {
                    console.log(err);
                }
            }
        })();
    }, [wallet]);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            Hello World
        </div>
    );
}

export default App;
