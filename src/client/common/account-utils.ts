import { Connection } from '@solana/web3.js';

export class AccountUtils {
    conn: Connection;

    constructor(conn: Connection) {
        this.conn = conn;
    }
}
