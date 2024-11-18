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

  it("Valid project intialization", async () => {
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
    assert.isTrue(projectData.admin.equals(admin.publicKey));
    assert.strictEqual(projectData.projectName, projectName);
    assert.strictEqual(projectData.githubHandle, githubHandle);
    assert.strictEqual(projectData.vaultBump, vaultBump);
    assert.strictEqual(projectData.bump, projectBump);
    assert.isTrue(projectData.teamLut.equals(teamLut));
  });

  it("Fail on invalid project initialization", async () => {
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

  it("Valid member addition", async () => {
    const [member] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("member"),
        project.toBuffer(),
        teamMember1.publicKey.toBuffer(),
      ],
      program.programId
    );

    await program.methods
      .addMember("lezend", "thelezend")
      .accountsStrict({
        member,
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
    const isTeamMember1Present = addresses.some((addr) =>
      addr.equals(teamMember1.publicKey)
    );
    assert.isTrue(
      isTeamMember1Present,
      "teamMember1's public key should be present in the lookup table"
    );
  });

  it("Fail on invalid member addition", async () => {
    await airdropSol(provider.connection, hacker.publicKey);

    const [hackerMember] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from("member"), project.toBuffer(), hacker.publicKey.toBuffer()],
      program.programId
    );

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

  it("Change admin", async () => {
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

  it("Fail on invalid admin change", async () => {
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
