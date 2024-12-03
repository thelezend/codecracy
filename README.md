# Codecracy

**Website**: [Codecracy](https://codecracy.vercel.app/)  
**Devnet Address**: `j8RWHX7RcLfWxkimpbgrSv6cPjUdpdGvjj3n3ikd53S`  

## Overview

Codecracy is a decentralized protocol built on Solana, developed as part of the **Q4 2024 [Turbin3](https://x.com/solanaturbine) Cohort Capstone Project**. The protocol incentivizes code contributions by enabling transparent tracking, voting, and reward mechanisms for developers.

Inspired by the principles of democracy, Codecracy emphasizes **fairness, transparency, and equality** in software development. It leverages Solana's cutting-edge blockchain features, such as Address Lookup Tables, for scalable and efficient team management without requiring centralized backends.

---

## Program Instructions

### **Protocol Management**

- [initialize_config](programs/codecracy/src/instructions/initialize_config.rs): Set up the initial protocol configuration.  
- [edit_config](programs/codecracy/src/instructions/edit_config.rs): Modify protocol configuration parameters.

### **Project Management**

- [initialize_project](programs/codecracy/src/instructions/initialize_project.rs): Create a new project, define metadata, and authorize team members.  
- [close_project](programs/codecracy/src/instructions/close_project.rs): Deactivate and archive an existing project.  
- [change_admin](programs/codecracy/src/instructions/change_admin.rs): Transfer administrative rights to another team member.

### **Member Management**

- [add_member](programs/codecracy/src/instructions/add_member.rs): Add a new contributor to the project.  
- [remove_member](programs/codecracy/src/instructions/remove_member.rs): Remove an existing contributor.

### **Voting and Rewards**

- [start_poll](programs/codecracy/src/instructions/start_poll.rs): Launch a voting poll to evaluate a specific contribution.  
- [cast_vote](programs/codecracy/src/instructions/cast_vote.rs): Submit a vote on an active poll.  
- [claim](programs/codecracy/src/instructions/claim.rs): Claim rewards based on the contribution score determined through voting.

---

## Architecture and Technical Highlights

### **State Management**

The program employs **Program Derived Address (PDA)** accounts to manage protocol state, ensuring robust, decentralized, and transparent data storage. Detailed implementations and schemas are available in the [state](programs/codecracy/src/state) directory of the program's codebase.

### **Efficient Team Management**

Using **Solana's Address Lookup Tables**, the protocol allows dynamic team member updates, ensuring scalability without needing backend infrastructure.

### **Security and Reliability**

The protocol includes comprehensive access control mechanisms, ensuring only authorized actions can be performed. It mitigates risks associated with tampering or unauthorized access to sensitive operations.

---

## Building and Testing

To build and run tests for Codecracy, follow these steps:

1. Install dependencies:

   ```bash
   yarn install
   anchor test
   ```

## Test Coverage

The test suite thoroughly validates:

- Core functionality of all program instructions.
- Role-based access control and permission management.
- Edge cases and potential security vulnerabilities.
- Robust handling of state transitions.
