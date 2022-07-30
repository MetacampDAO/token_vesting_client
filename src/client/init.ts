import { Connection, PublicKey } from '@solana/web3.js';
import { VestingClient } from './tokenVesting.client';
import * as idl from './idl/vesting.json';
import { Wallet } from '@project-serum/anchor';

const VESTING_PROG_ID = new PublicKey('cBvCy7Qi492GybgwLbARVPPTk3cBCKbatMZaZwZR8is');

export const conn: Connection = new Connection('https://api.devnet.solana.com');

export async function initVestingClient(wallet: Wallet) {
    return new VestingClient(conn, wallet, idl as any, VESTING_PROG_ID);
}
