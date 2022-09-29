# Vault contract Development.


## Overview

We’re going to build the custodial storage vault contract for assets being used in the lending & borrowing Defi protocol.

The first step in the process of interacting with the vault is the depositing by a user of any asset. The user will then obtain a specific amount of vault shares representing ownership of their deposited tokens.

Shares will be calculated utilizing the following formula: 
```
share = (_amount * currentTotal) / currentUnderlyingBalance 
```

Where:  <br/>
•	share = the number of vault shares the user receives <br/>
•	_amount = amount of a particular asset that the user deposits <br/>
•	currentTotal = amount of shares already created for this vault <br/>
•	currentUnderlyingBalance = amount of the particular deposited asset already in the vault <br/>

This vault contract should be upgradable using the UUPS proxy pattern.


## Requirements
### Main actions 
#### deposit: User deposits any ERC20 tokens into vault and get vault shares
#### withdraw:  User withdraws the underlying tokens with vault shares.
#### transfer: Function to transfer vault shares from one to another.
#### flashLoan:
- Users can call this function to do flashloan borrow from our vault.
- You can use ERC3156 Flash loan method here.
- There is a flashLoanFee that is charged by the borrower. After successful action of flashLoan, the flashloanFee percent of total borrowed amount will be transferred from the borrower to this vault again.
```
  function flashLoan(
        IERC3156FlashBorrower _receiver,
        address _token,
        uint256 _amount,
        bytes calldata _data
    ) external returns (bool)
 ```
#### approveContract
- This function will enable or disable the whitelisted contracts to transfer or withdraw user’s vault shares. You can use EIP712 hashing and signing method here.
```
function approveContract(
        address _user,
        address _contract,
        bool _status,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {}
```
### Admin-level actions
#### updateCode: This contract is using UUPS proxy pattern and admin can upgrade using updateCode function.
#### pause & unpause: Admin can pause/unpause all the above main functions. 
#### emergencyWidthdraw: Admin can call this function to do emergency withdraw any ERC20 tokens when the vault is paused.
#### allowContract: Admin can add or remove contracts to the whitelist.
#### updateFlashloanRate: Admin can update the flashLoanRate using this 

### Other view helper functions
#### toShare
- Helper view function that represents an amount of token in shares.
```
function toShare(
        IERC20 token,
        uint256 amount
    ) external view returns (uint256);
```
#### toUnderlying
- Helper view function that represents shares back into the token amount
```
function toUnderlying(
        IERC20 token,
        uint256 share
    ) external view returns (uint256);
```
