// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '../interfaces/IERC20.sol';
import '../interfaces/IERC3156FlashBorrower.sol';
import '../interfaces/IERC3156FlashLender.sol';
import 'hardhat/console.sol';

/**
 * @author MasterDevv
 * @dev Extension of {ERC20} that allows flash borrowing.
 */
contract FlashBorrowerMock is IERC3156FlashBorrower {
    enum Action {
        NORMAL,
        OTHER,
        SPECIAL
    }

    IERC3156FlashLender lender;

    constructor(IERC3156FlashLender lender_) {
        lender = lender_;
    }

    /**
     * @dev Receive a flash loan.
     * @param initiator The initiator of the loan.
     * @param token The loan currency.
     * @param amount The amount of tokens lent.
     * @param fee The additional amount of tokens to repay.
     * @param data Arbitrary data structure, intended to contain user-defined parameters.
     * @return The keccak256 hash of "ERC3156FlashBorrower.onFlashLoan"
     */
    function onFlashLoan(
        address initiator,
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata data
    ) external view override returns (bytes32) {
        bytes32 successData;
        require(initiator == address(this), 'FlashBorrower: Untrusted loan initiator');
        require(msg.sender == address(lender), 'FlashBorrower: Untrusted lender');

        Action action = abi.decode(data, (Action));
        if (action == Action.NORMAL) {
            // do one thing
            successData = keccak256('ERC3156FlashBorrower.onFlashLoan');
        } else if (action == Action.OTHER) {
            // do another
            successData = keccak256('ERC3156FlashBorrower.onFlashLoan Error');
        } else {
            successData = keccak256('ERC3156FlashBorrower.onFlashLoan Error');
        }
        return successData;
    }

    /**
     * @dev User call this function for flashLoan.
     * @param token ERC20Token address
     * @param amount flashLoan amount
     */
    function flashBorrow(
        address token,
        uint256 amount,
        Action key
    ) public {
        bytes memory data;
        if (key == Action.NORMAL) {
            data = abi.encode(Action.NORMAL);
        } else if (key == Action.OTHER) {
            data = abi.encode(Action.OTHER);
        } else {
            data = abi.encode(key);
        }

        uint256 _allowance = IERC20(token).allowance(address(this), address(lender));
        uint256 _fee = lender.flashFee(amount);
        uint256 _repayment = amount + _fee;
        IERC20(token).approve(address(lender), _allowance + _repayment);
        lender.flashLoan(this, token, amount, data);
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
    ) external {
        lender.transfer(_user, _receiver, _token, _share);
    }

    /**
     * @dev User withdraws the underlying tokens with vault shares.
     * Note This function can be called by user and user-approved contracts.
     * @param _user User address to withdraw.
     * @param _token Token address to withdraw.
     */
    function withdraw(address _user, address _token, uint256 _share) external {
        lender.withdraw(_user, _token, _share);
    }
}
