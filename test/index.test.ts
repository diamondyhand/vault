import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { deploySC, toWei } from "./helper";
import { signTypedData, IMsgParams } from './EIP712';
import { FlashBorrowerMock, ERC20Mock, Vault } from '../types'
import {
  MAX_DECIMAL,
} from "./constants";

const timeTravel = async (seconds: number) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
};
interface ISignData {
  v: Number;
  r: string;
  s: string
}

describe("Vault Contract Test.", () => {
  let Admin: SignerWithAddress;
  let Tom: SignerWithAddress;
  let Jerry: SignerWithAddress;
  let Matin: SignerWithAddress;
  let Vault: Vault;
  let UserContract: FlashBorrowerMock;
  let USTC: ERC20Mock;
  let WETH: ERC20Mock;
  let DAI: ERC20Mock;
  const U100 = toWei(100, MAX_DECIMAL);
  const U200 = toWei(200, MAX_DECIMAL);
  const U1K = toWei(1000, MAX_DECIMAL);
  const U5K = toWei(5000, MAX_DECIMAL);
  const U10K = toWei(10000, MAX_DECIMAL);
  const U100K = toWei(100000, MAX_DECIMAL);
  const U200K = toWei(200000, MAX_DECIMAL);
  const U300K = toWei(300000, MAX_DECIMAL);
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  let msgParams: IMsgParams;
  let signData: ISignData;
  beforeEach(async () => {
    [Admin, Tom, Jerry, Matin] = await ethers.getSigners();
    // ERC20 Tokens
    USTC = <ERC20Mock>(
      await deploySC("ERC20Mock", [])
    )
    WETH = <ERC20Mock>(
      await deploySC("ERC20Mock", [])
    )
    DAI = <ERC20Mock>(
      await deploySC("ERC20Mock", [])
    )
    Vault = <Vault>(
      await deploySC("Vault", [1])
    )
    UserContract = <FlashBorrowerMock>(
      await deploySC("FlashBorrowerMock", [Vault.address])
    )

    await DAI.mint(Tom.address, U200K);
    await DAI.mint(Jerry.address, U200K);
    await DAI.mint(Matin.address, U200K);

    msgParams = {
      types: {
        EIP712Domain: [
          { name: "name", type: "string" },
          { name: "version", type: "string" },
          { name: "chainId", type: "uint256" },
          { name: "verifyingContract", type: "address" }
        ],
        set: [
          { name: "sender", type: "address" },
        ]
      },
      primaryType: "set",
      domain: {
        name: "SetTest",
        version: "1",
        chainId: 1,
        verifyingContract: UserContract.address
      },
      message: {
        sender: Tom.address
      }
    }
    signData = await signTypedData(Tom.address, msgParams);
  });

  describe("Test Start.", () => {
    describe("deposit function.", () => {
      it("revert if user did not approve or not enough amount.", async () => {
        await expect(Vault.deposit(DAI.address, U10K)).to.be.revertedWith("Vault: You must be approve.");
        await DAI.connect(Tom).approve(Vault.address, U300K);
        await expect(Vault.connect(Tom).deposit(DAI.address, U300K)).to.be.revertedWith("Vault: deposit amount not enough.");
      })

      it("deposit successful.", async () => {
        await DAI.connect(Tom).approve(Vault.address, U200K);
        await Vault.connect(Tom).deposit(DAI.address, U100K);
        await Vault.connect(Tom).deposit(DAI.address, U100K);
      })
    })

    describe("approveContract function.", () => {
      it("revert if admin did not allow.", async () => {
        await expect(Vault.connect(Tom).approveContract(Tom.address, UserContract.address, true, signData.v, signData.r, signData.s)).to.be.revertedWith("Vault: contract must be allowed.");
      })

      it("revert if admin did invalid signature.", async () => {
        await Vault.allowContract(UserContract.address, true);
        await expect(Vault.connect(Tom).approveContract(Tom.address, UserContract.address, true, signData.v, signData.r, signData.r)).to.be.revertedWith("ApproveFunction: invalid signature");
      })


      it("approveContract successful.", async () => {
        await Vault.allowContract(UserContract.address, true);
        await Vault.connect(Tom).approveContract(Tom.address, UserContract.address, true, signData.v, signData.r, signData.s);
      })
    })

    describe("withdraw and emergencyWithdraw function.", () => {
      it("revert if msgSender is not user or whitelist.", async () => {
        await expect(Vault.connect(Tom).withdraw(Jerry.address, DAI.address)).to.be.revertedWith("Vault: withdraw permission error.");
      })

      it("revert if user's withdraw amount is zero.", async () => {
        await expect(Vault.connect(Tom).withdraw(Tom.address, DAI.address)).to.be.revertedWith("Vault: withdraw amount not exist.");
      })


      it("withdraw successful.", async () => {
        await DAI.connect(Tom).approve(Vault.address, U200K);
        await Vault.connect(Tom).deposit(DAI.address, U100K);
        await Vault.connect(Tom).withdraw(Tom.address, DAI.address);
      })
    })

    describe("transfer function.", () => {
      it("revert if msgSender is not user or whitelist.", async () => {
        await expect(Vault.connect(Tom).transfer(Jerry.address, Tom.address, DAI.address, 1000)).to.be.revertedWith("Vault: transfer permission error.");
      })

      it("revert if user's shares is smaller that sending share.", async () => {
        await expect(Vault.connect(Tom).transfer(Tom.address, Jerry.address, DAI.address, 1000000000)).to.be.revertedWith("Vault: transfer amount error.");
      })

      it("transfer successful.", async () => {
        await DAI.connect(Tom).approve(Vault.address, U200K);
        await Vault.connect(Tom).deposit(DAI.address, U100K);
        await Vault.connect(Tom).transfer(Tom.address, Jerry.address, DAI.address, 1000);
      })
    })

    describe("maxFlashLoan and setPause function.", async () => {
      it("maxFlashLoan successful.", async () => {
        await Vault.setPause(true);
        await Vault.setPause(false);
        const maxFlashLoan = await Vault.maxFlashLoan(DAI.address);
      })
    })

    describe("emergencyWithdraw function.", async () => {
      it("emergencyWithdraw successful.", async () => {
        await DAI.connect(Tom).approve(Vault.address, U200K);
        await Vault.connect(Tom).deposit(DAI.address, U100K);
        await Vault.emergencyWithdraw(Tom.address, DAI.address);
      })
    })

    describe("updateFlashloanfeeRate function.", async () => {
      it("updateFlashloanfeeRate successful.", async () => {
        await Vault.updateFlashloanfeeRate(2);
      })
    })
  });
})