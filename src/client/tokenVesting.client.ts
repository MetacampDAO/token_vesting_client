import * as anchor from '@project-serum/anchor';
import { Idl, AnchorProvider } from '@project-serum/anchor';
import { Connection, PublicKey, SYSVAR_CLOCK_PUBKEY } from '@solana/web3.js';
import { getAssociatedTokenAddress } from '@solana/spl-token';
import { Vesting } from './idl/vesting';
import { AccountUtils } from './common/account-utils';

export class VestingClient extends AccountUtils {
    wallet: anchor.Wallet;
    provider!: anchor.Provider;
    vestingProgram!: anchor.Program<Vesting>;

    constructor(conn: Connection, wallet: anchor.Wallet, idl?: Idl, programId?: PublicKey) {
        super(conn);
        this.wallet = wallet;
        this.setProvider();
        this.setVestingProgram(idl, programId);
    }

    setProvider() {
        this.provider = new AnchorProvider(this.conn, this.wallet, AnchorProvider.defaultOptions());
        anchor.setProvider(this.provider);
    }

    setVestingProgram(idl?: Idl, programId?: PublicKey) {
        //instantiating program depends on the environment
        if (idl && programId) {
            //means running in prod
            this.vestingProgram = new anchor.Program<Vesting>(idl as any, programId, this.provider);
        }
    }

    // --------------------------------------- fetch deserialized accounts

    async fetchVestingScheduleHeader(passphrase: string) {
        const [vestingAccount] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(anchor.utils.bytes.utf8.encode(passphrase))],
            this.vestingProgram.programId
        );

        const x = await this.vestingProgram.account.vestingScheduleHeader.fetch(vestingAccount);

        return x;
    }

    // --------------------------------------- find PDA adsdresses

    async findVestingTokenAccount(vestingAccount: PublicKey, mintAddress: PublicKey) {
        const [vestingTokenAccount] = await anchor.web3.PublicKey.findProgramAddress(
            [mintAddress.toBuffer(), vestingAccount.toBuffer()],
            this.vestingProgram.programId
        );

        return vestingTokenAccount;
    }

    async findVestingAccountAddress(passphrase: string) {
        const [vestingAccount] = await anchor.web3.PublicKey.findProgramAddress(
            [Buffer.from(anchor.utils.bytes.utf8.encode(passphrase))],
            this.vestingProgram.programId
        );

        return vestingAccount;
    }

    // --------------------------------------- find all PDA addresses

    async findAllVestingAccByManagerKey(managerKey: PublicKey) {
        const filter = [
            {
                memcmp: {
                    offset: 8 + 32, //prepend for anchor's discriminator & tokenAccount
                    bytes: managerKey.toBase58(),
                },
            },
        ];
        return this.vestingProgram.account.vestingScheduleHeader.all(filter);
    }

    // --------------------------------------- vesting ixs

    async create(
        manager: PublicKey,
        employee: PublicKey,
        mintKey: PublicKey,
        releaseInterval: number[],
        amountInterval: number[],
        seedphase: string
    ) {
        const managerTokenAccount = await getAssociatedTokenAddress(mintKey, manager);
        const employeeTokenAccount = await getAssociatedTokenAddress(mintKey, employee);

        const parsedReleaseInterval = releaseInterval.map((v) => new anchor.BN(v));
        const parsedAmountInterval = amountInterval.map((v) => new anchor.BN(v));

        const vestingAccount = await this.findVestingAccountAddress(seedphase);

        const vestingTokenAccount = await this.findVestingTokenAccount(vestingAccount, mintKey);

        const createIx = await this.vestingProgram.methods
            .create(parsedReleaseInterval, parsedAmountInterval, seedphase)
            .accounts({
                initializer: manager,
                vestingAccount,
                srcTokenAccount: managerTokenAccount,
                dstTokenAccountOwner: employee,
                dstTokenAccount: employeeTokenAccount,
                vestingTokenAccount,
                mintAddress: mintKey,
            })
            .instruction();

        return { createIx };
    }

    async unlock(seedphase: string) {
        const vestingAccount = await this.findVestingAccountAddress(seedphase);
        const vestingAccountInfo = await this.fetchVestingScheduleHeader(seedphase);

        const vestingTokenAccount = await this.findVestingTokenAccount(vestingAccount, vestingAccountInfo.mintKey);

        const unlockIx = await this.vestingProgram.methods
            .unlock(seedphase)
            .accounts({
                vestingAccount,
                vestingTokenAccount,
                dstTokenAccount: vestingAccountInfo.destinationTokenAccount,
                mintAddress: vestingAccountInfo.mintKey,
                clock: SYSVAR_CLOCK_PUBKEY,
            })
            .instruction();

        return { unlockIx };
    }

    async changeDestination(seedphase: string, newDestination: PublicKey) {
        const vestingAccount = await this.findVestingAccountAddress(seedphase);
        const vestingAccountInfo = await this.fetchVestingScheduleHeader(seedphase);
        const newDestinationTokenAccount = await getAssociatedTokenAddress(vestingAccountInfo.mintKey, newDestination);

        const changeDestinationIx = await this.vestingProgram.methods
            .changeDestination(seedphase)
            .accounts({
                vestingAccount,
                currentDestinationTokenAccountOwner: vestingAccountInfo.destinationTokenAccountOwner,
                currentDestinationTokenAccount: vestingAccountInfo.destinationTokenAccount,
                newDestinationTokenAccount: newDestination,
                newDestinationTokenAccountOwner: newDestinationTokenAccount,
            })
            .instruction();

        return { changeDestinationIx };
    }

    async closeContract(walletTokenAccount: PublicKey, seedphase: string) {
        const vestingAccount = await this.findVestingAccountAddress(seedphase);
        const vestingAccountInfo = await this.fetchVestingScheduleHeader(seedphase);
        const vestingTokenAccount = await this.findVestingTokenAccount(vestingAccount, vestingAccountInfo.mintKey);

        const closeContractIx = await this.vestingProgram.methods
            .closeAccount(seedphase)
            .accounts({
                vestingAccount,
                initializer: vestingAccountInfo.srcTokenAccountOwner,
                vestingTokenAccount,
                srcTokenAccount: vestingAccountInfo.srcTokenAccount,
                mintAddress: vestingAccountInfo.mintKey,
                clock: SYSVAR_CLOCK_PUBKEY,
            })
            .instruction();

        return { closeContractIx };
    }
}

// Create frontend to test script
