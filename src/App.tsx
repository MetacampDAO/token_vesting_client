import React, { useState, useEffect } from 'react';
import { AnchorWallet, useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { initVestingClient } from './client/init';
import { Wallet } from '@project-serum/anchor';
import { VestingClient } from './client/tokenVesting.client';
import { Keypair, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import {
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
    createInitializeMintInstruction,
    createMintToInstruction,
    createAssociatedTokenAccountInstruction,
    getAssociatedTokenAddress,
} from '@solana/spl-token';

function App() {
    const wallet = useAnchorWallet();
    const { connection } = useConnection();
    const [client, setClient] = useState<VestingClient | null>(null);
    const [mintAmount, setMintAmount] = useState(0);
    const [destination, setDestination] = useState('');
    const [mintKey, setMintKey] = useState('');
    const [seedPhrase, setSeedPhrase] = useState('');
    const [latestTx, setLatestTx] = useState('');

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

    const signAndSendTransaction = async (
        transaction: Transaction,
        wallet: AnchorWallet,
        partialSign = false,
        signer: Keypair | null = null
    ) => {
        transaction.recentBlockhash = (await connection.getLatestBlockhash('singleGossip')).blockhash;
        transaction.feePayer = wallet.publicKey;

        if (partialSign && signer) transaction.partialSign(signer);

        const signedTx = await wallet.signTransaction(transaction);
        const rawTransaction = signedTx.serialize();
        const txSig = await connection.sendRawTransaction(rawTransaction);
        return txSig;
    };

    const handleCreateMint = async () => {
        if (wallet && mintAmount > 1000000) {
            const lamports = await connection.getMinimumBalanceForRentExemption(MINT_SIZE);
            const mint = Keypair.generate();
            const walletTokenAccount = await getAssociatedTokenAddress(mint.publicKey, wallet.publicKey);
            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mint.publicKey,
                    space: MINT_SIZE,
                    lamports,
                    programId: TOKEN_PROGRAM_ID,
                }),
                createInitializeMintInstruction(mint.publicKey, 6, wallet.publicKey, wallet.publicKey),
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    walletTokenAccount,
                    wallet.publicKey,
                    mint.publicKey
                ),
                createMintToInstruction(mint.publicKey, walletTokenAccount, wallet.publicKey, mintAmount)
            );

            const txSig = await signAndSendTransaction(transaction, wallet, true, mint);

            setMintKey(mint.publicKey.toString());
            setLatestTx(txSig);
            console.log('txSig', txSig);
        }
    };

    const handleSubmit = async () => {
        if (client && wallet && mintKey && destination) {
            const to = new PublicKey(destination);
            const mintPub = new PublicKey(mintKey);
            const { createIx } = await client.create(wallet.publicKey, to, mintPub, [1, 2, 3], [1, 2, 3], seedPhrase);
            const destinationTokenAccount = await getAssociatedTokenAddress(mintPub, to);
            const transaction = new Transaction().add(
                createAssociatedTokenAccountInstruction(wallet.publicKey, destinationTokenAccount, to, mintPub),
                createIx
            );

            const txSig = await signAndSendTransaction(transaction, wallet);
            setLatestTx(txSig);

            console.log('Create txSig: ', txSig);
        }
    };

    const handleUnlock = async () => {
        if (client && wallet && mintKey && destination) {
            const { unlockIx } = await client.unlock(seedPhrase);
            const transaction = new Transaction().add(unlockIx);

            const txSig = await signAndSendTransaction(transaction, wallet);
            setLatestTx(txSig);

            console.log('Unlock txSig: ', txSig);
        }
    };

    const handleClose = async () => {
        if (client && wallet && mintKey && destination) {
            const walletTokenAccount = await getAssociatedTokenAddress(new PublicKey(mintKey), wallet.publicKey);
            const { closeContractIx } = await client.closeContract(walletTokenAccount, seedPhrase);

            const transaction = new Transaction().add(closeContractIx);

            const txSig = await signAndSendTransaction(transaction, wallet);
            setLatestTx(txSig);
            console.log('Close Contract txSig: ', txSig);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <input type="number" placeholder="suppy" onChange={(e) => setMintAmount(+e.target.value)} />
                <button onClick={handleCreateMint}>Create Mint</button>
            </div>
            <div>
                <h2 style={{ height: '50px', color: 'white' }}>{mintKey && `Mint Address: ${mintKey.toString()}`}</h2>
            </div>
            <div>
                <input type="text" onChange={(e) => setDestination(e.target.value)} placeholder="Destination" />
            </div>
            <div>
                <input
                    type="text"
                    value={mintKey?.toString()}
                    onChange={(e) => setMintKey(e.target.value)}
                    placeholder="Mint Address"
                />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <input type="text" onChange={(e) => setSeedPhrase(e.target.value)} placeholder="Seedphrase" />
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleSubmit}>Create Contract</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleUnlock}>Trigger Unlock</button>
            </div>
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleClose}>Close Account</button>
            </div>
            <h2>
                {latestTx && (
                    <a href={`https://solana.fm/tx/${latestTx}?cluster=devnet-solana`} style={{ color: 'white' }}>
                        View Latest Transaction
                    </a>
                )}
            </h2>
        </div>
    );
}

export default App;
