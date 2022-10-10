// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0 || ^0.8.0;

import './interfaces/IERC20.sol';
import './interfaces/IERC3156FlashBorrower.sol';
import './interfaces/IERC3156FlashLender.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import 'hardhat/console.sol';

/**
 * @author MasterDevv
 * @dev Extension of {ERC20} that allows flash lending.
 */
contract Vault is IERC3156FlashLender, Ownable, Pausable, ReentrancyGuard {
    // mapping (User address => (ERC20Token(Usable) => amount of vault share))
    mapping(address => mapping(address => uint256)) public userShares;

    // mapping (Contract address => user's address)
    mapping(address => mapping(address => bool)) public whiteList;

    // mapping to contract to whitelist status
    mapping(address => bool) public allowedContracts;

    // mapping (ERC20Token(Usable) => currentTotal(amount of shares already created for this vault))
    mapping(address => uint256) public totalShares;
    // mapping (ERC20Token(Usable) => currentUnderlyingBalance((amount of the particular depoosited asset already in the vault.)))
    mapping(address => uint256) public totalAmounts;

    uint256 public feeRate; //  1 == 0.01 %.
    bytes32 public constant CALLBACK_SUCCESS = keccak256('ERC3156FlashBorrower.onFlashLoan');

    /**
     * @param feeRate_ The percentage of the loan `amount` that needs to be repaid, in addition to `amount`.
     */
    constructor(uint256 feeRate_) {
        feeRate = feeRate_;
    }

    /**
     * @dev User deposits any ERC20 tokens into vault and get vault shares.
     * @notice In other words, User should be send to Vault Contract.
     * @param token Token address to deposit.
     * @param amount Amount to deposit.
     */
    function deposit(address token, uint256 amount) external payable whenNotPaused {
        require(
            IERC20(token).allowance(msg.sender, address(this)) >= amount && amount != 0,
            'Vault: You must be approve.'
        );
        require(IERC20(token).balanceOf(msg.sender) >= amount, 'Vault: deposit amount not enough.');
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        if (totalAmounts[token] == 0) {
            userShares[msg.sender][token] = totalShares[token];
        } else {
            uint256 share = ((amount * totalShares[token])) / totalAmounts[token];
            totalShares[token] += share;
            userShares[msg.sender][token] = share;
        }
        totalAmounts[token] += amount;
    }

    /**
     * @dev User withdraws the underlying tokens with vault shares.
     * Note This function can be called by user and user-approved contracts.
     * @param user User address to withdraw.
     * @param token Token address to withdraw.
     */
    function withdraw(address user, address token) external payable override whenNotPaused {
        require(
            user == msg.sender ||
                (whiteList[msg.sender][user] == true && allowedContracts[msg.sender] == true),
            'Vault: withdraw permission error.'
        );
        uint256 amount = toUnderlying(IERC20(token), userShares[user][token]);
        require(amount > 0, 'Vault: withdraw amount error.');
        totalAmounts[token] -= amount;
        totalShares[token] -= userShares[user][token];
        userShares[user][token] = 0;
        IERC20(token).transfer(user, amount);
    }

    /**
     * @dev Transfer Function to transfer vault shares from one to another.
     * Note This function can be called by user and user-approved contracts.
     * @param user spender address to transfer
     * @param receiver receiver address to transfer
     * @param token token(ERC20) address to transfer
     * @param share A amount of vault share to transfer
     */
    function transfer(
        address user,
        address receiver,
        address token,
        uint256 share
    ) external payable override whenNotPaused {
        require(
            user == msg.sender ||
                (whiteList[msg.sender][user] == true && allowedContracts[msg.sender] == true),
            'Vault: transfer permission error.'
        );
        require(userShares[user][token] >= share, 'Vault: transfer amount error.');
        userShares[user][token] -= share;
        userShares[receiver][token] += share;
    }

    /**
     * @dev Loan `amount` tokens to `receiver`, and takes it back plus a `flashFee` after the callback.
     * @param receiver The contract receiving the tokens, needs to implement the `onFlashLoan(address user, uint256 amount, uint256 fee, bytes calldata)` interface.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @param data A data parameter to be passed on to the `receiver` for any custom use.
     */
    function flashLoan(
        IERC3156FlashBorrower receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external override whenNotPaused returns (bool) {
        uint256 feeMount = _flashFee(token, amount);
        require(amount <= totalAmounts[token] && amount > 0, 'Vault: flashLoan amount Error.');
        IERC20(token).transfer(address(receiver), amount);
        require(
            receiver.onFlashLoan(msg.sender, token, amount, feeMount, data) == CALLBACK_SUCCESS,
            'Vault: Callback failed.'
        );
        require(
            IERC20(token).balanceOf(address(receiver)) >= amount + feeMount,
            'Vault: FlashBorrower failed flashLoan.'
        );
        IERC20(token).transferFrom(address(receiver), address(this), amount + feeMount);
        return true;
    }

    /**
     * @dev This function will enable or disable the whitelisted contracts
     * to transfer or withdraw user's vault shares. EIP712 hashing and signing method.
     * @param user user's address
     * @param addr user's approved contract(whiteList) == FlashBorrower's address
     * @param status enable(true) or disable
     * @param v EIP712 hashing param v
     * @param r EIP712 hashing param r
     * @param s EIP712 hashing param s
     */
    function approveContract(
        address user,
        address addr,
        bool status,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external whenNotPaused {
        require(allowedContracts[addr] == true, 'Vault: contract must be allowed.');
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        bytes32 eip712DomainHash = keccak256(
            abi.encode(
                keccak256(
                    'EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'
                ),
                keccak256(bytes('SetTest')),
                keccak256(bytes('1')),
                chainId,
                address(addr)
            )
        );
        bytes32 hashStruct = keccak256(abi.encode(keccak256('set(address sender)'), user));
        bytes32 hash = keccak256(abi.encodePacked('\x19\x01', eip712DomainHash, hashStruct));
        address signer = ecrecover(hash, v, r, s);
        require(signer == user && signer != address(0), 'ApproveFunction: invalid signature');
        whiteList[addr][user] = status;
    }

    /**
     * @dev The fee to be charged for a given loan.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @return The amount of `token` to be charged for the loan, on top of the returned principal.
     */
    function flashFee(address token, uint256 amount) external view override returns (uint256) {
        return _flashFee(token, amount);
    }

    /**
     * @dev The fee to be charged for a given loan. Internal function with no checks.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @return The amount of `token` to be charged for the loan, on top of the returned principal.
     */
    function _flashFee(address token, uint256 amount) internal view returns (uint256) {
        return (amount * feeRate) / 10000;
    }

    /**
     * @dev The amount of currency available to be lent.
     * @param token The loan currency.
     * @return The amount of `token` that can be borrowed.
     */
    function maxFlashLoan(address token) public view override returns (uint256) {
        return totalAmounts[token];
    }

    // Admin-level actions

    /**
     * @dev This contract is using UUPS proxy pattern and admin can upgrade using updateCode function.
     * @param newCode upgrade contract address
     */
    function updateCode(address newCode) external onlyOwner {}

    /**
     * @dev Admin can pause/unpause all the above main functions.
     * @param pause paused status(true: pause, false: unpause)
     */
    function setPause(bool pause) external onlyOwner {
        if (pause == true) {
            _pause();
        } else {
            _unpause();
        }
    }

    /**
     * @dev Admin can call this function to do emergency withdraw any ERC20 tokens when the vault is paused.
     * @param user user's address for withdraw
     * @param token ERC20token address for withdraw
     * @param amount amount for withdraw
     */
    function emergencyWithdraw(
        address user,
        address token,
        uint256 amount
    ) external onlyOwner {
        uint256 _amount = (userShares[user][token] * totalAmounts[token]) / totalShares[token];
        require(amount <= _amount && amount > 0, 'Vault: emergencyWithdraw amount error.');
        IERC20(token).transfer(user, amount);
    }

    /**
     * @dev Admin can add or remove contracts to the whitelist.
     * @param addr contract address that you'll add or remove in whitelist.
     * @param status add: true, remove: false
     */
    function allowContract(address addr, bool status) external onlyOwner {
        allowedContracts[addr] = status;
    }

    /**
     * @dev Admin can update the flashLoanfeeRate using this.
     * @param feeRate_ flashLoan-feeRate that you'll update.
     */
    function updateFlashloanfeeRate(uint256 feeRate_) external onlyOwner {
        feeRate = feeRate_;
    }

    // Helper functions

    /**
     * @dev Helper view function that represents an amount of token in shares.
     * @param token ERC20Token interface for convert
     * @param amount amount of ERC20Token
     */
    function toShare(IERC20 token, uint256 amount) public view returns (uint256 share) {
        share = (amount * totalShares[address(token)]) / totalAmounts[address(token)];
    }

    /**
     * @dev Helper view function that represents shares back into the token amount
     * @param token ERC20Token interface for convert
     * @param share share of ERC20Token
     */
    function toUnderlying(IERC20 token, uint256 share) public view returns (uint256 amount) {
        amount = (share * totalAmounts[address(token)]) / totalShares[address(token)];
    }

    // test function(for show shares)
    function viewShare(address addr, address token) public view onlyOwner returns (uint256 amount) {
        amount = userShares[addr][token];
    }
}
