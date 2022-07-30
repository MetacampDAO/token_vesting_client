export type Vesting = {
  "version": "0.1.0",
  "name": "vesting",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccountOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "releaseInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "amountInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "unlock",
      "accounts": [
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "changeDestination",
      "accounts": [
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentDestinationTokenAccountOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "currentDestinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDestinationTokenAccountOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDestinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "closeAccount",
      "accounts": [
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vestingScheduleHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "srcTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "srcTokenAccountOwner",
            "type": "publicKey"
          },
          {
            "name": "destinationTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "destinationTokenAccountOwner",
            "type": "publicKey"
          },
          {
            "name": "mintKey",
            "type": "publicKey"
          },
          {
            "name": "schedules",
            "type": {
              "vec": {
                "defined": "VestingSchedule"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "VestingSchedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "releaseTime",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidIntervalInput",
      "msg": "Invalid releaseInterval and amountInterval. Must be the same length."
    },
    {
      "code": 6001,
      "name": "ZeroUnlockAmount",
      "msg": "No outstanding unlockable balance."
    },
    {
      "code": 6002,
      "name": "UnlockAmountFirst",
      "msg": "There are outstanding unlockable balance. Please unlock balance first"
    }
  ]
};

export const IDL: Vesting = {
  "version": "0.1.0",
  "name": "vesting",
  "instructions": [
    {
      "name": "create",
      "accounts": [
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccountOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "releaseInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "amountInterval",
          "type": {
            "vec": "u64"
          }
        },
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "unlock",
      "accounts": [
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "dstTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "changeDestination",
      "accounts": [
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "currentDestinationTokenAccountOwner",
          "isMut": false,
          "isSigner": true
        },
        {
          "name": "currentDestinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDestinationTokenAccountOwner",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "newDestinationTokenAccount",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    },
    {
      "name": "closeAccount",
      "accounts": [
        {
          "name": "vestingAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "initializer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "vestingTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "srcTokenAccount",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "mintAddress",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "seedphase",
          "type": "string"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vestingScheduleHeader",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "srcTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "srcTokenAccountOwner",
            "type": "publicKey"
          },
          {
            "name": "destinationTokenAccount",
            "type": "publicKey"
          },
          {
            "name": "destinationTokenAccountOwner",
            "type": "publicKey"
          },
          {
            "name": "mintKey",
            "type": "publicKey"
          },
          {
            "name": "schedules",
            "type": {
              "vec": {
                "defined": "VestingSchedule"
              }
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "VestingSchedule",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "releaseTime",
            "type": "u64"
          },
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "InvalidIntervalInput",
      "msg": "Invalid releaseInterval and amountInterval. Must be the same length."
    },
    {
      "code": 6001,
      "name": "ZeroUnlockAmount",
      "msg": "No outstanding unlockable balance."
    },
    {
      "code": 6002,
      "name": "UnlockAmountFirst",
      "msg": "There are outstanding unlockable balance. Please unlock balance first"
    }
  ]
};
