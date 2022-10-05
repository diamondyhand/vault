// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0 || ^0.8.0;

import "./interfaces/IERC20.sol";
import "./interfaces/IERC3156FlashBorrower.sol";
import "./interfaces/IERC3156FlashLender.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 * @author MasterDevv
 * @dev Extension of {ERC20} that allows flash lending.
 */
contract Vault is IERC3156FlashLender, Ownable {
    // mapping (User address => (ERC20Token(Usable) => amount of vault share))
    mapping(address => mapping(address => uint256)) public userShares;

    /// @notice mapping (Contract address => user's address)
    mapping(address => mapping(address => bool)) public whiteList;

    /// @notice mapping to contract to whitelist status
    mapping(address => bool) public allowedContracts;

    // mapping (ERC20Token(Usable) => currentTotal(amount of shares already created for this vault))
    mapping(address => uint256) public totalShares;
    // mapping (ERC20Token(Usable) => currentUnderlyingBalance((amount of the particular depoosited asset already in the vault.)))
    mapping(address => uint256) public totalAmounts;

    uint256 public feeRate; //  1 == 0.01 %.
    uint256 public constant decimal = 10**10;
    // Main actions pause status
    bool public paused;
    bytes32 public constant CALLBACK_SUCCESS =
        keccak256("ERC3156FlashBorrower.onFlashLoan");

    /**
     * @param _feeRate The percentage of the loan `amount` that needs to be repaid, in addition to `amount`.
     */
    constructor(uint256 _feeRate) {
        feeRate = _feeRate;
    }

    modifier isUnPaused() {
        require(paused == false, "Main functions paused.");
        _;
    }

    /**
     * @dev User deposits any ERC20 tokens into vault and get vault shares.
     * @notice In other words, User should be send to Vault Contract.
     * @param _token Token address to deposit.
     * @param _amount Amount to deposit.
     */
    function deposit(address _token, uint256 _amount)
        external
        payable
        isUnPaused
    {
        require(
            IERC20(_token).allowance(msg.sender, address(this)) >= _amount &&
                _amount != 0,
            "Vault: You must be approve."
        );
        require(
            IERC20(_token).balanceOf(msg.sender) >= _amount,
            "Vault: deposit amount not enough."
        );
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        if (totalAmounts[_token] == 0) {
            userShares[msg.sender][_token] = totalShares[_token];
        } else {
            uint256 share = ((_amount * totalShares[_token])) /
                totalAmounts[_token];
            totalShares[_token] += share;
            userShares[msg.sender][_token] = share;
        }
        totalAmounts[_token] += _amount;
    }

    /**
     * @dev User withdraws the underlying tokens with vault shares.
     * Note This function can be called by user and user-approved contracts.
     * @param _user User address to withdraw.
     * @param _token Token address to withdraw.
     */
    function withdraw(address _user, address _token)
        external
        payable
        override
        isUnPaused
    {
        require(
            _user == msg.sender ||
                (whiteList[msg.sender][_user] == true &&
                    allowedContracts[msg.sender] == true),
            "Vault: withdraw permission error."
        );
        uint256 amount = toUnderlying(
            IERC20(_token),
            userShares[_user][_token]
        );
        require(amount > 0, "Vault: withdraw amount error.");
        totalAmounts[_token] -= amount;
        totalShares[_token] -= userShares[_user][_token];
        userShares[_user][_token] = 0;
        IERC20(_token).transfer(_user, amount);
    }

    /**
     * @dev Transfer Function to transfer vault shares from one to another.
     * Note This function can be called by user and user-approved contracts.
     * @param _user spender address to transfer
     * @param _receiver receiver address to transfer
     * @param _token token(ERC20) address to transfer
     * @param _share A amount of vault share to transfer
     */
    function transfer(
        address _user,
        address _receiver,
        address _token,
        uint256 _share
    ) external payable override isUnPaused {
        require(
            _user == msg.sender ||
                (whiteList[msg.sender][_user] == true &&
                    allowedContracts[msg.sender] == true),
            "Vault: transfer permission error."
        );
        require(
            userShares[_user][_token] >= _share,
            "Vault: transfer amount error."
        );
        userShares[_user][_token] -= _share;
        userShares[_receiver][_token] += _share;
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
    ) external override isUnPaused returns (bool) {
        uint256 feeMount = _flashFee(token, amount);
        require(
            amount <= totalAmounts[token] && amount > 0,
            "Vault: flashLoan amount Error."
        );
        IERC20(token).transfer(address(receiver), amount);
        require(
            receiver.onFlashLoan(msg.sender, token, amount, feeMount, data) ==
                CALLBACK_SUCCESS,
            "Vault: Callback failed."
        );
        require(
            IERC20(token).balanceOf(address(receiver)) >= amount + feeMount,
            "Vault: FlashBorrower failed flashLoan."
        );
        IERC20(token).transferFrom(
            address(receiver),
            address(this),
            amount + feeMount
        );
        return true;
    }

    /**
     * @dev This function will enable or disable the whitelisted contracts
     * to transfer or withdraw user's vault shares. EIP712 hashing and signing method.
     * @param _user user's address
     * @param _contract user's approved contract(whiteList) == FlashBorrower's address
     * @param _status enable(true) or disable
     * @param v EIP712 hashing param v
     * @param r EIP712 hashing param r
     * @param s EIP712 hashing param s
     */
    function approveContract(
        address _user,
        address _contract,
        bool _status,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(
            allowedContracts[_contract] == true,
            "Vault: contract must be allowed."
        );
        uint256 chainId;
        assembly {
            // chainId := chainid()
            chainId := 1
        }
        // chainId = 1337;
        bytes32 eip712DomainHash = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("SetTest")),
                keccak256(bytes("1")),
                chainId,
                address(_contract)
            )
        );

        bytes32 hashStruct = keccak256(
            abi.encode(keccak256("set(address sender)"), _user)
        );

        bytes32 hash = keccak256(
            abi.encodePacked("\x19\x01", eip712DomainHash, hashStruct)
        );
        address signer = ecrecover(hash, v, r, s);
        require(
            signer == _user || signer != address(0),
            "ApproveFunction: invalid signature"
        );
        whiteList[_contract][_user] = _status;
    }

    /**
     * @dev The fee to be charged for a given loan.
     * @param _token The loan currency.
     * @param _amount The amount of tokens lent.
     * @return The amount of `token` to be charged for the loan, on top of the returned principal.
     */
    function flashFee(address _token, uint256 _amount)
        external
        view
        override
        returns (uint256)
    {
        return _flashFee(_token, _amount);
    }

    /**
     * @dev The fee to be charged for a given loan. Internal function with no checks.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @return The amount of `token` to be charged for the loan, on top of the returned principal.
     */
    function _flashFee(address token, uint256 amount)
        internal
        view
        returns (uint256)
    {
        return (amount * feeRate) / 10000;
    }

    /**
     * @dev The amount of currency available to be lent.
     * @param token The loan currency.
     * @return The amount of `token` that can be borrowed.
     */
    function maxFlashLoan(address token)
        public
        view
        override
        returns (uint256)
    {
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
     * @param _paused paused status(true: pause, false: unpause)
     */
    function setPause(bool _paused) public onlyOwner {
        paused = _paused;
    }

    /**
     * @dev Admin can call this function to do emergency withdraw any ERC20 tokens when the vault is paused.
     * @param _user user's address for withdraw
     * @param _token ERC20token address for withdraw
     * @param _amount amount for withdraw
     */
    function emergencyWithdraw(
        address _user,
        address _token,
        uint256 _amount
    ) external onlyOwner {
        uint256 amount = (userShares[_user][_token] * totalAmounts[_token]) /
            totalShares[_token];
        require(
            _amount <= amount && _amount > 0,
            "Vault: emergencyWithdraw amount error."
        );
        IERC20(_token).transfer(_user, _amount);
    }

    /**
     * @dev Admin can add or remove contracts to the whitelist.
     * @param _addr contract address that you'll add or remove in whitelist.
     * @param _status add: true, remove: false
     */
    function allowContract(address _addr, bool _status) external onlyOwner {
        allowedContracts[_addr] = _status;
    }

    /**
     * @dev Admin can update the flashLoanfeeRate using this.
     * @param _feeRate flashLoan-feeRate that you'll update.
     */
    function updateFlashloanfeeRate(uint256 _feeRate) external onlyOwner {
        feeRate = _feeRate;
    }

    // Helper functions

    /**
     * @dev Helper view function that represents an amount of token in shares.
     * @param _token ERC20Token interface for convert
     * @param _amount amount of ERC20Token
     */
    function toShare(IERC20 _token, uint256 _amount)
        public
        view
        returns (uint256 _share)
    {
        _share =
            (_amount * totalShares[address(_token)]) /
            totalAmounts[address(_token)];
    }

    /**
     * @dev Helper view function that represents shares back into the token amount
     * @param _token ERC20Token interface for convert
     * @param _share share of ERC20Token
     */
    function toUnderlying(IERC20 _token, uint256 _share)
        public
        view
        returns (uint256 _amount)
    {
        _amount =
            (_share * totalAmounts[address(_token)]) /
            totalShares[address(_token)];
    }

    // test function(for show shares)
    function viewShare(address _addr, address _token)
        public
        view
        onlyOwner
        returns (uint amount)
    {
        amount = userShares[_addr][_token];
    }
}
