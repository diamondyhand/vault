import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { deploySC, toWei } from "./helper";
import { signTypedData, IMsgParams } from './EIP712';
import { FlashBorrowerMock, ERC20Mock, Vault } from '../types'
import {
  UST_DECIMAL,
} from "./constants";
import Web3 from "web3";

const timeTravel = async (seconds: number) => {
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine", []);
};

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
  const UST100 = toWei(100, UST_DECIMAL);
  const UST200 = toWei(200, UST_DECIMAL);
  const UST1K = toWei(1000, UST_DECIMAL);
  const UST5K = toWei(5000, UST_DECIMAL);
  const UST10K = toWei(10000, UST_DECIMAL);
  const UST100K = toWei(100000, UST_DECIMAL);
  const UST200K = toWei(200000, UST_DECIMAL);
  const UST300K = toWei(300000, UST_DECIMAL);
  const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
  let msgParams: IMsgParams;

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
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    console.log("asdf ais ", web3);
    await signTypedData(Tom.address, msgParams);

    console.log("consiole");
  });

  describe("Test Start.", () => {
    describe("Lock function.", () => {
      it("revert if lock error.(amount, approve, period error.)", async () => {
      })
    })
  });
})