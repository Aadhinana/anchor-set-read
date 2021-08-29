const anchor = require('@project-serum/anchor');
const assert = require("assert")

describe('set_read', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());
  let provider = anchor.getProvider();
  // Read the program deployed on chain
  const program = anchor.workspace.SetRead;
  // Create a new account that will be initialized
  const myAccount = anchor.web3.Keypair.generate();

  it('Is initialized!', async () => {
    // Call the intialize isntruction defined in the program and pass it an initial value of 42
    // singers takes the signatures of accounts
    // instruction takes the instruction to be executed before this function i.e initialize
    const tx = await program.rpc.initialize(new anchor.BN(42), {
      accounts: {
        myAccount: myAccount.publicKey,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY
      },
      signers: [myAccount],
      instructions: [
        anchor.web3.SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: myAccount.publicKey,
          space: 8 + 8,
          lamports: await provider.connection.getMinimumBalanceForRentExemption(8 + 8),
          programId: program.programId
        }),
      ],
    });
    // program.account returns a AccountClient Type
    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log(account);
    console.log("Your transaction signature", tx);
    assert.ok(account.data.eq(new anchor.BN(42)));
  });

  it('can update itself with new data passedd to it', async () => {
    // Call the update instruction wiht a new value to be set.
    const tx = await program.rpc.update(new anchor.BN(420), {
      accounts: {
        myAccount: myAccount.publicKey
      },
    })

    const account = await program.account.myAccount.fetch(myAccount.publicKey);
    console.log(account)
    assert.ok(account.data.eq(new anchor.BN(420)));
  })
});
