/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/codecracy.json`.
 */
export type Codecracy = {
  address: "j8RWHX7RcLfWxkimpbgrSv6cPjUdpdGvjj3n3ikd53S";
  metadata: {
    name: "codecracy";
    version: "0.1.0";
    spec: "0.1.0";
    description: "Created with Anchor";
  };
  instructions: [
    {
      name: "addMember";
      discriminator: [13, 116, 123, 130, 126, 198, 57, 34];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
          relations: ["project"];
        },
        {
          name: "newUser";
        },
        {
          name: "project";
        },
        {
          name: "member";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 109, 98, 101, 114];
              },
              {
                kind: "account";
                path: "project";
              },
              {
                kind: "account";
                path: "newUser";
              }
            ];
          };
        },
        {
          name: "teamLut";
          writable: true;
        },
        {
          name: "atlProgram";
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "githubHandle";
          type: "string";
        }
      ];
    },
    {
      name: "castVote";
      discriminator: [20, 212, 15, 189, 69, 180, 69, 151];
      accounts: [
        {
          name: "voter";
          writable: true;
          signer: true;
        },
        {
          name: "project";
        },
        {
          name: "pollInitializorMember";
          writable: true;
        },
        {
          name: "poll";
          writable: true;
        },
        {
          name: "vote";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 111, 116, 101];
              },
              {
                kind: "account";
                path: "poll";
              },
              {
                kind: "account";
                path: "voter";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "voteType";
          type: {
            defined: {
              name: "voteType";
            };
          };
        }
      ];
    },
    {
      name: "changeAdmin";
      discriminator: [193, 151, 203, 161, 200, 202, 32, 146];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
          relations: ["projectConfig"];
        },
        {
          name: "newAdmin";
        },
        {
          name: "projectConfig";
          writable: true;
        }
      ];
      args: [];
    },
    {
      name: "claim";
      discriminator: [62, 198, 214, 193, 213, 159, 108, 210];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "project";
        },
        {
          name: "member";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 109, 98, 101, 114];
              },
              {
                kind: "account";
                path: "project";
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "vault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "project";
              }
            ];
          };
        },
        {
          name: "config";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "protocolVault";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "config";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "closeProject";
      discriminator: [117, 209, 53, 106, 93, 55, 112, 49];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
          relations: ["project"];
        },
        {
          name: "project";
          writable: true;
        },
        {
          name: "vault";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "project";
              }
            ];
          };
        }
      ];
      args: [];
    },
    {
      name: "editConfig";
      discriminator: [244, 197, 215, 48, 246, 184, 210, 138];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
          relations: ["config"];
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        }
      ];
      args: [
        {
          name: "newAdmin";
          type: {
            option: "pubkey";
          };
        },
        {
          name: "feeBasisPoints";
          type: {
            option: "u16";
          };
        }
      ];
    },
    {
      name: "initializeConfig";
      discriminator: [208, 127, 21, 1, 194, 190, 196, 70];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
        },
        {
          name: "config";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [99, 111, 110, 102, 105, 103];
              }
            ];
          };
        },
        {
          name: "vault";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "config";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [];
    },
    {
      name: "initializeProject";
      discriminator: [69, 126, 215, 37, 20, 60, 73, 235];
      accounts: [
        {
          name: "admin";
          docs: [
            "The creator/admin of the project who will pay for initialization"
          ];
          writable: true;
          signer: true;
        },
        {
          name: "project";
          docs: [
            "Project configuration account that stores project details",
            "This PDA is derived from the project name and Github handle"
          ];
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [
                  112,
                  114,
                  111,
                  106,
                  101,
                  99,
                  116,
                  45,
                  99,
                  111,
                  110,
                  102,
                  105,
                  103
                ];
              },
              {
                kind: "arg";
                path: "projectName";
              },
              {
                kind: "arg";
                path: "githubHandle";
              }
            ];
          };
        },
        {
          name: "vault";
          docs: [
            "Project vault that will hold the project's funds",
            "This PDA is derived from the project_config PDA"
          ];
          pda: {
            seeds: [
              {
                kind: "const";
                value: [118, 97, 117, 108, 116];
              },
              {
                kind: "account";
                path: "project";
              }
            ];
          };
        },
        {
          name: "lookupTable";
          writable: true;
        },
        {
          name: "atlProgram";
        },
        {
          name: "systemProgram";
          docs: ["Required system program"];
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "projectName";
          type: "string";
        },
        {
          name: "githubHandle";
          type: "string";
        },
        {
          name: "slot";
          type: "u64";
        }
      ];
    },
    {
      name: "removeMember";
      discriminator: [171, 57, 231, 150, 167, 128, 18, 55];
      accounts: [
        {
          name: "admin";
          writable: true;
          signer: true;
          relations: ["project"];
        },
        {
          name: "memberPubkey";
        },
        {
          name: "project";
        },
        {
          name: "member";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 109, 98, 101, 114];
              },
              {
                kind: "account";
                path: "project";
              },
              {
                kind: "account";
                path: "memberPubkey";
              }
            ];
          };
        }
      ];
      args: [];
    },
    {
      name: "startPoll";
      discriminator: [59, 188, 204, 28, 129, 88, 202, 242];
      accounts: [
        {
          name: "user";
          writable: true;
          signer: true;
        },
        {
          name: "project";
        },
        {
          name: "member";
          pda: {
            seeds: [
              {
                kind: "const";
                value: [109, 101, 109, 98, 101, 114];
              },
              {
                kind: "account";
                path: "project";
              },
              {
                kind: "account";
                path: "user";
              }
            ];
          };
        },
        {
          name: "poll";
          writable: true;
          pda: {
            seeds: [
              {
                kind: "const";
                value: [112, 111, 108, 108];
              },
              {
                kind: "arg";
                path: "pullRequest";
              },
              {
                kind: "account";
                path: "project";
              }
            ];
          };
        },
        {
          name: "systemProgram";
          address: "11111111111111111111111111111111";
        }
      ];
      args: [
        {
          name: "pullRequest";
          type: "u32";
        },
        {
          name: "closeTime";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "config";
      discriminator: [155, 12, 170, 224, 30, 250, 204, 130];
    },
    {
      name: "member";
      discriminator: [54, 19, 162, 21, 29, 166, 17, 198];
    },
    {
      name: "poll";
      discriminator: [110, 234, 167, 188, 231, 136, 153, 111];
    },
    {
      name: "project";
      discriminator: [205, 168, 189, 202, 181, 247, 142, 19];
    },
    {
      name: "vote";
      discriminator: [96, 91, 104, 57, 145, 35, 172, 155];
    }
  ];
  errors: [
    {
      code: 6000;
      name: "invalidProjectName";
      msg: "Length of the project name must be between 1 and 32 characters";
    },
    {
      code: 6001;
      name: "invalidGithubHandle";
      msg: "Length of the github handle must be between 1 and 32 characters";
    }
  ];
  types: [
    {
      name: "config";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            type: "pubkey";
          },
          {
            name: "vault";
            type: "pubkey";
          },
          {
            name: "feeBasisPoints";
            type: "u16";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "vaultBump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "member";
      type: {
        kind: "struct";
        fields: [
          {
            name: "project";
            type: "pubkey";
          },
          {
            name: "memberPubkey";
            type: "pubkey";
          },
          {
            name: "isActive";
            type: "bool";
          },
          {
            name: "fundsClaimed";
            type: "bool";
          },
          {
            name: "score";
            type: "u64";
          },
          {
            name: "bump";
            type: "u8";
          },
          {
            name: "githubHandle";
            type: "string";
          }
        ];
      };
    },
    {
      name: "poll";
      type: {
        kind: "struct";
        fields: [
          {
            name: "user";
            type: "pubkey";
          },
          {
            name: "project";
            type: "pubkey";
          },
          {
            name: "pullRequest";
            type: "u32";
          },
          {
            name: "votes";
            type: "u32";
          },
          {
            name: "closeTime";
            type: "u64";
          },
          {
            name: "rejections";
            type: "u32";
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "project";
      type: {
        kind: "struct";
        fields: [
          {
            name: "admin";
            docs: ["The public key of the project creator/admin"];
            type: "pubkey";
          },
          {
            name: "isActive";
            docs: ["Is the project active"];
            type: "bool";
          },
          {
            name: "teamLut";
            docs: ["Lookup table for team members"];
            type: "pubkey";
          },
          {
            name: "claimableFunds";
            type: "u64";
          },
          {
            name: "bump";
            docs: ["PDA bump seed for account derivation"];
            type: "u8";
          },
          {
            name: "vaultBump";
            type: "u8";
          },
          {
            name: "projectName";
            docs: ["Project name, limited by MAX_PROJECT_NAME_LENGTH"];
            type: "string";
          },
          {
            name: "githubHandle";
            type: "string";
          }
        ];
      };
    },
    {
      name: "vote";
      type: {
        kind: "struct";
        fields: [
          {
            name: "voter";
            type: "pubkey";
          },
          {
            name: "project";
            type: "pubkey";
          },
          {
            name: "poll";
            type: "pubkey";
          },
          {
            name: "voteType";
            type: {
              defined: {
                name: "voteType";
              };
            };
          },
          {
            name: "bump";
            type: "u8";
          }
        ];
      };
    },
    {
      name: "voteType";
      type: {
        kind: "enum";
        variants: [
          {
            name: "low";
          },
          {
            name: "medium";
          },
          {
            name: "high";
          },
          {
            name: "reject";
          }
        ];
      };
    }
  ];
  constants: [
    {
      name: "configSeed";
      type: "string";
      value: '"config"';
    },
    {
      name: "memberSeed";
      type: "string";
      value: '"member"';
    },
    {
      name: "pollSeed";
      type: "string";
      value: '"poll"';
    },
    {
      name: "projectConfigSeed";
      type: "string";
      value: '"project-config"';
    },
    {
      name: "vaultSeed";
      type: "string";
      value: '"vault"';
    },
    {
      name: "voteSeed";
      type: "string";
      value: '"vote"';
    }
  ];
};
