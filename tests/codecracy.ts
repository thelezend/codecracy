import * as anchor from "@coral-xyz/anchor";
import { web3 } from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Codecracy } from "../target/types/codecracy";
import { assert } from "chai";

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
    assert.deepEqual(projectData, {
      admin: admin.publicKey,
      projectName,
      githubHandle,
      teamLut,
      isActive: true,
      bump: projectBump,
      vaultBump,
    });
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
    let member1Name = "lezend";
    let member1GithubHandle = "thelezend";

    await program.methods
      .addMember(member1Name, member1GithubHandle)
      .accountsStrict({
        member: member1,
        project,
        admin: admin.publicKey,
        teamLut,
        memberPubkey: teamMember1.publicKey,
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
        .addMember("lezend", "thelezend")
        .accountsStrict({
          member: hackerMember,
          project,
          admin: hacker.publicKey,
          teamLut,
          memberPubkey: hacker.publicKey,
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
      .initializePoll(1, new anchor.BN(1732103413))
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
        .initializePoll(2, new anchor.BN(1732103413))
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
    await program.methods
      .closeProject()
      .accountsStrict({
        admin: admin.publicKey,
        project,
      })
      .rpc();

    assert.isFalse(
      (await program.account.project.fetch(project)).isActive,
      "Project should be closed"
    );
  });

  it("Fail on hacker project closure", async () => {
    try {
      await program.methods
        .closeProject()
        .accountsStrict({
          admin: hacker.publicKey,
          project,
        })
        .signers([hacker])
        .rpc();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "ConstraintHasOne");
    }
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
