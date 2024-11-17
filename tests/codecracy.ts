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

  it("Valid project intialization", async () => {
    const projectName = "codeCracy";
    const githubHandle = "turbin3";

    let [projectConfig] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(PROJECT_CONFIG_SEED),
        Buffer.from(projectName),
        Buffer.from(githubHandle),
      ],
      program.programId
    );

    let [vault] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(VAULT_SEED), projectConfig.toBuffer()],
      program.programId
    );

    await program.methods
      .initializeProject(projectName, githubHandle)
      .accountsStrict({
        projectConfig,
        admin: admin.publicKey,
        vault,
        systemProgram: web3.SystemProgram.programId,
      })
      .rpc();
  });

  it("Invalid project initialization", async () => {
    // Empty project name
    let projectName = "";
    let githubHandle = "a";

    let [projectConfig] = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(PROJECT_CONFIG_SEED),
        Buffer.from(projectName),
        Buffer.from(githubHandle),
      ],
      program.programId
    );

    let [vault] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(VAULT_SEED), projectConfig.toBuffer()],
      program.programId
    );

    try {
      await program.methods
        .initializeProject(projectName, githubHandle)
        .accountsStrict({
          projectConfig,
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

    projectConfig = web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from(PROJECT_CONFIG_SEED),
        Buffer.from(projectName),
        Buffer.from(githubHandle),
      ],
      program.programId
    )[0];

    vault = web3.PublicKey.findProgramAddressSync(
      [Buffer.from(VAULT_SEED), projectConfig.toBuffer()],
      program.programId
    )[0];

    try {
      await program.methods
        .initializeProject(projectName, githubHandle)
        .accountsStrict({
          projectConfig,
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
});
