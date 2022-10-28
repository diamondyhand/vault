// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
import './IERC3156FlashBorrower.sol';

interface IERC3156FlashLender {
    /**
     * @dev The amount of currency available to be lent.
     * @param token The loan currency.
     * @return The amount of `token` that can be borrowed.
     */
    function maxFlashLoan(address token) external view returns (uint256);

    /**
     * @dev The fee to be charged for a given loan.
     * @param amount The amount of tokens lent.
     * @return The amount of `token` to be charged for the loan, on top of the returned principal.
     */
    function flashFee(uint256 amount) external view returns (uint256);

    /**
     * @dev Initiate a flash loan.
     * @param receiver The receiver of the tokens in the loan, and the receiver of the callback.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @param data Arbitrary data structure, intended to contain user-defined parameters.
     */
    function flashLoan(
        IERC3156FlashBorrower receiver,
        address token,
        uint256 amount,
        bytes calldata data
    ) external returns (bool);

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
    ) external payable;

    /**
     * @dev User withdraws the underlying tokens with vault shares.
     * Note This function can be called by user and user-approved contracts.
     * @param _user User address to withdraw.
     * @param _token Token address to withdraw.
     */
    function withdraw(address _user, address _token) external payable;
}
