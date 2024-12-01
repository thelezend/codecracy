import * as anchor from "@coral-xyz/anchor";
import { Program, web3 } from "@coral-xyz/anchor";
import { assert } from "chai";
import { Codecracy } from "../target/types/codecracy";

const CONFIG_SEED = "config";
const PROJECT_CONFIG_SEED = "project-config";
const VAULT_SEED = "vault";

describe("codecracy", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Codecracy as Program<Codecracy>;
  const provider = <anchor.AnchorProvider>anchor.getProvider();

  const admin = provider.wallet as anchor.Wallet;
  const hacker = anchor.web3.Keypair.generate();
  const teamMember1 = anchor.web3.Keypair.generate();
  let teamLut: web3.PublicKey;

  const projectName = "codeCracy";
  const githubHandle = "turbin3";

  let [config, configBump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(CONFIG_SEED)],
    program.programId
  );

  let [protocolVault, protocolVaultBump] =
    web3.PublicKey.findProgramAddressSync(
      [Buffer.from(VAULT_SEED), config.toBuffer()],
      program.programId
    );

  let [project, projectBump] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from(PROJECT_CONFIG_SEED),
      Buffer.from(projectName),
      Buffer.from(githubHandle),
    ],
    program.programId
  );

  let [vault, vaultBump] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_SEED), project.toBuffer()],
    program.programId
  );

  const [member1, member1Bump] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("member"),
      project.toBuffer(),
      teamMember1.publicKey.toBuffer(),
    ],
    program.programId
  );

  const [hackerMember] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from("member"), project.toBuffer(), hacker.publicKey.toBuffer()],
    program.programId
  );

  it("Config Initialization", async () => {
    await program.methods
      .initializeConfig()
      .accountsStrict({
        admin: admin.publicKey,
        config,
        vault: protocolVault,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  });

  it("Edit config", async () => {
    await program.methods
      .editConfig(null, 300)
      .accountsStrict({
        admin: admin.publicKey,
        config,
      })
      .rpc();
  });

  it("Fail on invalid config edit", async () => {
    await airdropSol(provider.connection, hacker.publicKey);

    try {
      await program.methods
        .editConfig(null, 4001)
        .accountsStrict({
          admin: hacker.publicKey,
          config,
        })
        .signers([hacker])
        .rpc();
      assert.fail();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "ConstraintHasOne");
    }
  });

  it("Project intialization", async () => {
    let recent_slot = new anchor.BN(await provider.connection.getSlot());
    teamLut = web3.PublicKey.findProgramAddressSync(
      [project.toBuffer(), recent_slot.toArrayLike(Buffer, "le", 8)],
      anchor.web3.AddressLookupTableProgram.programId
    )[0];

    await program.methods
      .initializeProject(projectName, githubHandle, recent_slot)
      .accountsStrict({
        project,
        admin: admin.publicKey,
        vault,
        systemProgram: web3.SystemProgram.programId,
        lookupTable: teamLut,
        atlProgram: web3.AddressLookupTableProgram.programId,
      })
      .rpc({ skipPreflight: true });

    let projectData = await program.account.project.fetch(project);
    assert.equal(projectData.admin.toBase58(), admin.publicKey.toBase58());
    assert.equal(projectData.projectName, projectName);
    assert.equal(projectData.githubHandle, githubHandle);
    assert.equal(projectData.teamLut.toBase58(), teamLut.toBase58());
    assert.isTrue(projectData.isActive);
    assert.isTrue(projectData.claimableFunds.eq(new anchor.BN(0)));
    assert.equal(projectData.bump, projectBump);
    assert.equal(projectData.vaultBump, vaultBump);
  });

  it("Fail on hacker project initialization", async () => {
    // Empty project name
    let projectName = "";
    let githubHandle = "a";

    let [project] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(PROJECT_CONFIG_SEED),
        Buffer.from(projectName),
        Buffer.from(githubHandle),
      ],
      program.programId
    );

    let [vault] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(VAULT_SEED), project.toBuffer()],
      program.programId
    );

    let recent_slot = new anchor.BN(await provider.connection.getSlot());
    let invalidLookupTable = web3.PublicKey.findProgramAddressSync(
      [project.toBuffer(), recent_slot.toArrayLike(Buffer, "le", 8)],
      anchor.web3.AddressLookupTableProgram.programId
    )[0];

    try {
      await program.methods
        .initializeProject(projectName, githubHandle, recent_slot)
        .accountsStrict({
          project,
          admin: admin.publicKey,
          vault,
          systemProgram: web3.SystemProgram.programId,
          lookupTable: invalidLookupTable,
          atlProgram: web3.AddressLookupTableProgram.programId,
        })
        .rpc();
      assert.fail();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "InvalidProjectName");
    }

    // Empty github handle
    projectName = "codecracy";
    githubHandle = "";

    project = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(PROJECT_CONFIG_SEED),
        Buffer.from(projectName),
        Buffer.from(githubHandle),
      ],
      program.programId
    )[0];

    vault = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(VAULT_SEED), project.toBuffer()],
      program.programId
    )[0];

    try {
      await program.methods
        .initializeProject(projectName, githubHandle, recent_slot)
        .accountsStrict({
          project,
          admin: admin.publicKey,
          vault,
          systemProgram: web3.SystemProgram.programId,
          lookupTable: teamLut,
          atlProgram: web3.AddressLookupTableProgram.programId,
        })
        .rpc();
      assert.fail();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "InvalidGithubHandle");
    }
  });

  it("Member addition", async () => {
    let member1GithubHandle = "thelezend";

    await program.methods
      .addMember(member1GithubHandle)
      .accountsStrict({
        member: member1,
        project,
        admin: admin.publicKey,
        teamLut,
        newUser: teamMember1.publicKey,
        atlProgram: web3.AddressLookupTableProgram.programId,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    // Check if teamMember1's public key is present in the lookup table
    const atl = await provider.connection.getAddressLookupTable(teamLut);
    const addresses = atl.value.state.addresses;
    const isMember1Present = addresses.some((addr) => addr.equals(member1));
    assert.isTrue(
      isMember1Present,
      "Member1 PDA should be present in the lookup table"
    );
  });

  it("Fail on hacker member addition", async () => {
    await airdropSol(provider.connection, hacker.publicKey);

    try {
      await program.methods
        .addMember("thelezend")
        .accountsStrict({
          member: hackerMember,
          project,
          admin: hacker.publicKey,
          teamLut,
          newUser: hacker.publicKey,
          atlProgram: web3.AddressLookupTableProgram.programId,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([hacker])
        .rpc();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "ConstraintHasOne");
    }
  });

  let [poll, pollBump] = web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("poll"),
      new anchor.BN(1).toArrayLike(Buffer, "le", 4),
      project.toBuffer(),
    ],
    program.programId
  );

  it("Poll initialization", async () => {
    await airdropSol(provider.connection, teamMember1.publicKey);

    await program.methods
      .startPoll(1, new anchor.BN(Math.floor(Date.now() / 1000) + 60))
      .accountsStrict({
        project,
        member: member1,
        poll,
        user: teamMember1.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([teamMember1])
      .rpc();
  });

  it("Fail on hacker poll initialization", async () => {
    let hackerPoll = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("poll"),
        new anchor.BN(2).toArrayLike(Buffer, "le", 4),
        project.toBuffer(),
      ],
      program.programId
    )[0];

    try {
      await program.methods
        .startPoll(2, new anchor.BN(1732103413))
        .accountsStrict({
          project,
          member: member1,
          poll: hackerPoll,
          user: hacker.publicKey,
          systemProgram: web3.SystemProgram.programId,
        })
        .signers([hacker])
        .rpc();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "ConstraintSeeds");
    }
  });

  it("Cast vote", async () => {
    const [adminMember, adminMemberBump] =
      web3.PublicKey.findProgramAddressSync(
        [Buffer.from("member"), project.toBuffer(), admin.publicKey.toBuffer()],
        program.programId
      );

    await program.methods
      .addMember("admin101")
      .accountsStrict({
        member: adminMember,
        project,
        admin: admin.publicKey,
        teamLut,
        newUser: admin.publicKey,
        atlProgram: web3.AddressLookupTableProgram.programId,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();

    const [adminVote, adminVoteBump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("vote"), poll.toBuffer(), admin.publicKey.toBuffer()],
      program.programId
    );

    await program.methods
      .castVote({ medium: {} })
      .accountsStrict({
        poll,
        project,
        vote: adminVote,
        voter: admin.publicKey,
        systemProgram: web3.SystemProgram.programId,
        pollInitializorMember: member1,
      })
      .rpc();

    const member1Data = await program.account.member.fetch(member1);
    assert.isTrue(member1Data.score.eq(new anchor.BN(20))); // 20 points for medium vote
  });

  it("Member removal", async () => {
    await program.methods
      .removeMember()
      .accountsStrict({
        member: member1,
        project,
        memberPubkey: teamMember1.publicKey,
        admin: admin.publicKey,
      })
      .rpc();

    assert.isFalse(
      (await program.account.member.fetch(member1)).isActive,
      "Member should be removed"
    );
  });

  it("Fail on hacker member removal", async () => {
    await airdropSol(provider.connection, hacker.publicKey);

    const [hackerMember] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("member"), project.toBuffer(), hacker.publicKey.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .removeMember()
        .accountsStrict({
          member: member1,
          project,
          memberPubkey: hacker.publicKey,
          admin: hacker.publicKey,
        })
        .signers([hacker])
        .rpc();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "ConstraintHasOne");
    }
  });

  it("Project closure", async () => {
    // Airdrop funds to the vault
    await airdropSol(provider.connection, vault);

    await program.methods
      .closeProject()
      .accountsStrict({
        admin: admin.publicKey,
        project,
        vault,
      })
      .rpc();

    const projectData = await program.account.project.fetch(project);
    assert.isFalse(projectData.isActive, "Project should be closed");
    assert.isTrue(
      projectData.claimableFunds.eq(new anchor.BN(10 * web3.LAMPORTS_PER_SOL)),
      "Claimable funds should be equal to 10 SOL"
    );
  });

  it("Fail on hacker project closure", async () => {
    try {
      await program.methods
        .closeProject()
        .accountsStrict({
          admin: hacker.publicKey,
          project,
          vault,
        })
        .signers([hacker])
        .rpc();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "ConstraintHasOne");
    }
  });

  it("Claim funds", async () => {
    const prevUserBalance = await provider.connection.getBalance(
      teamMember1.publicKey
    );
    const prevProtocolVaultBalance = await provider.connection.getBalance(
      protocolVault
    );

    const lutAccount = (
      await provider.connection.getAddressLookupTable(teamLut)
    ).value;
    const remaining_accounts = lutAccount.state.addresses.map((addr) => ({
      pubkey: addr,
      isSigner: false,
      isWritable: false,
    }));

    const ix = await program.methods
      .claim()
      .accountsStrict({
        vault,
        member: member1,
        project,
        user: teamMember1.publicKey,
        systemProgram: web3.SystemProgram.programId,
        config,
        protocolVault,
      })
      .remainingAccounts(remaining_accounts)
      .instruction();

    const versionedTx = new web3.VersionedTransaction(
      new web3.TransactionMessage({
        payerKey: teamMember1.publicKey,
        recentBlockhash: (await provider.connection.getLatestBlockhash())
          .blockhash,
        instructions: [ix],
      }).compileToV0Message([lutAccount])
    );
    versionedTx.sign([teamMember1]);
    let tx = await provider.connection.sendTransaction(versionedTx, {
      preflightCommitment: "confirmed",
    });
    await provider.connection.confirmTransaction(tx, "confirmed");

    const memberData = await program.account.member.fetch(member1);
    assert.isTrue(memberData.fundsClaimed);

    const userBalance = await provider.connection.getBalance(
      teamMember1.publicKey
    );
    const protocolVaultBalance = await provider.connection.getBalance(
      protocolVault
    );

    assert.isTrue(
      userBalance > prevUserBalance,
      "User balance should increase"
    );
    assert.isTrue(
      protocolVaultBalance > prevProtocolVaultBalance,
      "Protocol vault balance should increase"
    );
  });

  it("Admin change", async () => {
    const newAdmin = anchor.web3.Keypair.generate();
    await airdropSol(provider.connection, newAdmin.publicKey);

    await program.methods
      .changeAdmin()
      .accountsStrict({
        projectConfig: project,
        admin: admin.publicKey,
        newAdmin: newAdmin.publicKey,
      })
      .rpc();

    // Another admin change
    const newAdmin2 = anchor.web3.Keypair.generate();
    await program.methods
      .changeAdmin()
      .accountsStrict({
        projectConfig: project,
        admin: newAdmin.publicKey,
        newAdmin: newAdmin2.publicKey,
      })
      .signers([newAdmin])
      .rpc();
  });

  it("Fail on hacker admin change", async () => {
    await airdropSol(provider.connection, hacker.publicKey);

    try {
      await program.methods
        .changeAdmin()
        .accountsStrict({
          projectConfig: project,
          admin: hacker.publicKey,
          newAdmin: hacker.publicKey,
        })
        .signers([hacker])
        .rpc();
      assert.fail();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "ConstraintHasOne");
    }
  });
});

async function airdropSol(
  connection: web3.Connection,
  address: web3.PublicKey
) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, 10 * web3.LAMPORTS_PER_SOL),
    "confirmed"
  );
}
