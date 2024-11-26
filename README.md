# Codecracy

A Solana program for incentivizing and tracking meaningful code contributions in collaborative projects.

Devnet address: `j8RWHX7RcLfWxkimpbgrSv6cPjUdpdGvjj3n3ikd53S`

## Overview

Codecracy is a decentralized protocol that enables teams to track, vote on, and reward code contributions. The program uses a transparent scoring system where team members vote on pull requests, and optionally includes a funding mechanism that distributes rewards based on contribution impact.

The program utilizes Solana's Address Lookup Tables to efficiently manage team members, allowing for dynamic addition and removal of members without requiring a backend. This approach enables scalable team management.

## Program Instructions

### Project Management

- `initialize_project`: Create a new project with metadata and authorized team members
- `close_project`: Close an existing project
- `change_admin`: Transfer project admin rights to another member

### Member Management

- `add_member`: Add a new member to the project
- `remove_member`: Remove an existing member from the project

### Voting and Rewards

- `start_poll`: Initialize a new voting poll for a contribution
- `cast_vote`: Cast a vote on an active poll
- `claim`: Claim rewards based on contribution scores

## Program State Accounts

For a comprehensive list of all Program Derived Address (PDA) accounts used to store the program's state, please refer to the `state` directory in the Solana program code.

## Building and Testing

To build and test the program, just use:

```bash
anchor test
```

The test suite includes comprehensive tests covering both functionality and security aspects, verifying:

- Core functionality of all program instructions
- Access control and permission management
- Edge cases and potential security vulnerabilities
- Proper handling of state management

## Running the Frontend

Make sure you have [Bun](https://bun.sh) installed, then run the following in the `web` directory:

```bash
bun run dev
```

## Development Status

While the core functionality is complete and working, both the program and frontend are still under active development with room for improvements and optimizations.
