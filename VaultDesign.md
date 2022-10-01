# 🚩 Vault Contract Design.

## **Vault(FlashLender)**, **FlashBorrow**, **Proxy** and **Proxiable** contract

- FlashBorrow Contract:  User's contract `whiteListed Contract`
- Vault Contract:  `Main Contract`
- Proxy Contract: `UUPS contract`
- Proxiable Contract: `UUPS contract`

## **Vault Variables** 📋
> struct **whiteInfo**
- Contract's status and approved users.
```js
  struct whiteInfo {
    mapping(address => bool) Users;
    bool status;  // add or remove status
  }
```
> mapping **supportedTokens**
- Those ERC20tokens are supported in Vault Contract.
```js
  // mapping (ERC20Token(Usable) => true or false)
  mapping(address => bool) public supportedTokens;
```

> mapping **userShares**
- amount that user have shares for ERC20Tokens.
```js
  // mapping (User address(ERC20Token(Usable) => amount of vault share)
  mapping(address => mapping(address => uint256)) public userShares;
```

> mapping **whiteList**
- approved Contract's InfoList
```js
  // mapping (Contract address => whiteInfo(contract's status and users))
  mapping(address => whiteInfo) public whiteList;
```

> mapping **totalShares**
- amount of shares already created for this vault
```js
  // mapping (ERC20Token(Usable) => currentTotal(amount of shares already created for this vault))
  mapping(address => uint256) public totalShares;
```

> mappingg **totalAmounts**
- amount of the particular depoosited asset already in the vault.
```js
  // mapping (ERC20Token(Usable) => currentUnderlyingBalance((amount of the particular depoosited asset already in the vault.)))
  mapping(address => uint256) public totalAmounts;
```

## **All Function Table** 🖥️

| Contract    | Function name       | Note             | Role                |
| ----------- | ------------------- | --------------   | ------------------- |
| FlashBorrow | onFlashLoan         |                  | `Vault`             |
| FlashBorrow | flashBorrow         |                  | `Vault`             |
| Vault       | deposit             | `Main Action`    | `User`              |
| Vault       | withdraw            | `Main Action`    | `WhiteList`, `User` |
| Vault       | transfer            | `Main Action`    | `WhiteList`, `User` |
| Vault       | flashLoan           | `Main Action`    | `User`              |
| Vault       | approveContract     | `Main Action`    | `User`              |
| Vault       | setPause            | `Admin Action`   | `Admin`             |
| Vault       | emergencyWidthdraw  | `Admin Action`   | `Admin`             |
| Vault       | allowContract       | `Admin Action`   | `Admin`             |
| Vault       | updateFlashloanRate | `Admin Action`   | `Admin`             |
| Vault       | toShare             | `Help Action`    | `All`               |
| Vault       | toUnderlying        | `Help Action`    | `All`               |
| Proxiable   | updateCodeAddress   | `Upgrade Action` | `All`               |
| Proxiable   | proxiableUUID       | `Upgrade Action` | `All`               |
| Proxy       | fallback            | `Upgrade Action` | `All`               |

## **FlashBorrow** Contract

> function **onFlashLoan**() 
```js
  /**
   * @dev User use this function to flashLoan.
   * @param initator this contract address(FlashBrrow address)
   * @param token ERC20Token address
   * @param amount flashLoan amount
   * @param fee flashLoan fee amount
   * @param data option data
   */
  function onFlashLoan(
    address initiator,
    address token,
    uint256 amount,
    uint256 fee,
    bytes calldata data
  ) external returns (bytes32);
```

> function **flashBorrow**()
```js
  /**
   * @dev User call this function for flashLoan.
   * @param token ERC20Token address for flashLoan
   * @param amount flashLoan amount(amount of ERC20Token)
   */
  function flashBorrow(
    address token,
    uint256 amount
  )
```

## **Vault** Contract (Main Action) 🔧
> function **deposit**()     
```js
  /**@dev When Users deposist ERC20 Tokens, They get vault of ERC20 amount(deposit amount).
   * @param _token Token address to deposit.
   * @param _amount Amount to deposit.
   */
  function deposit(
    address token,  
    address amount,
  ) external view payable;
```

> function withdraw() 
```js
  /**
   * @dev Users can get ERC20Token amount about their shares.
   * @notice whiteListed Contract can call this func.
   * @param token Token address to withdraw.
   * @param amount Amount of ERC20Token for withdraw
   */
  function withdraw(
    address token,
    address amount,
  ) external view payable;
```

> function **transfer**() 
```js
  /**
   * @dev Users can transfer ERC20 shares to other users using this func.
   * @notice whiteListed Contract can call this func.
   * @param _user spender address to transfer
   * @param _receiver receiver address to transfer
   * @param _token token(ERC20) address to transfer
   * @param _share vault share to transfer
   */
  function transfer(
    address _user,
    address _receiver,
    address _token,
    uint256 _share
  ) external view payable;
```

> function **flashLoan**() 
```js
  /**
   * @dev flashlender's main function. User can get profit using flashLoan.
   * @param receiver WhiteListed Contract
   * @param token The loan currency.
   * @param amount The amount of tokens lent.
   * @param data Option data
   */
  function flashLoan(
    IERC3156FlashBorrower _receiver,
    address _token,
    uint _amount,
    bytes calldata _data
  ) external returns (bool)
```

> function **approve**() 
```js
  /**
   * @dev This function will enable or disable the whitelisted contracts 
   * to transfer or withdraw user's vault shares. In here, param v, r, s is hashString of verifyingContract and signer. EIP712 hashing and signing method.
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
  ) external view payable;
```

## **Vault** Contract (Admin Actions) 🤖

> function **updateCode**() 
```js
  /**
   * @dev This contract is using UUPS proxy pattern and admin can upgrade using updateCode function.
   * @param newCode upgrade contract address
   */
  function updateCode(
    address newCode
  ) external view;
```

> function **setPause**()
```js
  /**
   * @dev Admin can pause/unpause all the above main functions.
   * @param _paused paused status(true: pause, false: unpause)
   */
  function setPause(
    bool _paused
  ) external;
```

> function **emergencyWidthdraw**()
```js
  /**
   * @dev when vault paused, admin can withdraw user's amount.
   * @param _user user's address for withdraw
   * @param _token ERC20token address for withdraw
   * @param _amount amount for ERC20token
   */
  function emergencyWidthdraw(
      address _user,
      address _token,
      uint _amount
  ) external;
```

> function **allowContract**()
```js
  /**
   * @dev Admin can add or remove contracts to the whitelist.
   * @param _addr contract address that you'll add or remove in whitelist.
   * @param _status add: true, remove: false
   */
  function allowContract(
    address _addr, 
    bool _status
  ) external;
```

> function **updateFalshloanRate**()
```js
  /**
   * @dev Admin can update the flashLoanfeeRate using this.
   * @param _feeRate flashLoan-feeRate that you'll update.
   */
  function updateFlashloanRate(
    uint _feeRate
  ) external;
```

## **Vault** Contract (Helper Actions) 💢

> function **toShare**()
```js
  /**
   * @dev User can know shares from ERC20token amount.
   * @param _token ERC20Token interface for convert
   * @param _amount amount of ERC20Token
   */
  function toShare(
    IERC20 _token, 
    uint _amount
  ) external;
```

> function **toUnderlying**()
```js
  /**
   * @dev User can know ERC20Token amount from share.
   * @param _token ERC20Token interface for convert
   * @param _share share of ERC20Token
   */
  function toUnderlying(
    IERC20 _token,
    uint _share
  ) external;
```

## **Proxy** Contract
You can use Proxy contract instead of Vault Contract.
In other words, this contract exist for upgrade.
Proxy contract only has fallback function.
`I use EIP-1822 proxy contract.`

## **Proxiable** Contract
You can use Proxiable contract for updateCode.
`updateCodeAddress` and `proxiableUUID` function.
`I use EIP-1822 proxiable contract.`