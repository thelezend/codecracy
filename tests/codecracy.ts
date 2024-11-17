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

  const projectName = "codeCracy";
  const githubHandle = "turbin3";

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

  it("Valid project intialization", async () => {
    await program.methods
      .initializeProject(projectName, githubHandle)
      .accountsStrict({
        projectConfig: project,
        admin: admin.publicKey,
        vault,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
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

    try {
      await program.methods
        .initializeProject(projectName, githubHandle)
        .accountsStrict({
          projectConfig: project,
          admin: admin.publicKey,
          vault,
          systemProgram: web3.SystemProgram.programId,
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
        .initializeProject(projectName, githubHandle)
        .accountsStrict({
          projectConfig: project,
          admin: admin.publicKey,
          vault,
          systemProgram: web3.SystemProgram.programId,
        })
        .rpc();
      assert.fail();
    } catch (_err) {
      const err = anchor.AnchorError.parse(_err.logs);
      assert.strictEqual(err.error.errorCode.code, "InvalidGithubHandle");
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
