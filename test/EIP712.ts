import { ethers } from "hardhat";
import { BigNumber } from "ethers";
import exp from "constants";
import Web3 from "web3";

export const deploySC = async (scName: string, params: any) => {
  const contract = await ethers.getContractFactory(scName);
  const SC = await contract.deploy(...params);
  await SC.deployed();
  return SC;
};

interface IResult {
  error: string;
  result: string;
}

export interface IMsgParams {
  types: {
    EIP712Domain: {
      name: string;
      type: string
    }[];
    set: {
      name: string;
      type: string
    }[];
  }
  primaryType: string;
  domain: {
    name: string;
    version: string;
    chainId: Number;
    verifyingContract: string
  };
  message: {
    sender: string
  }
}

export const signTypedData = function (from: string, data: IMsgParams) {
  return new Promise(async (resolve, reject) => {
    let web3: Web3;
    web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
    function cb(err: string, result: IResult) {
      if (err) {
        console.log("local is ", err);
        return reject(err);
      }
      if (result.error) {
        console.log("local is ", result.error);
        return reject(result.error);
      }
      const sig = result.result;
      const sig0 = sig.substring(2);
      const r = "0x" + sig0.substring(0, 64);
      const s = "0x" + sig0.substring(64, 128);
      const v = parseInt(sig0.substring(128, 130), 16);
      console.log("r v s ", r, v, s);
      resolve({
        data,
        sig,
        v, r, s
      });
    }
    if (web3.currentProvider.isMetaMask) {
      console.log("v3");
      web3.currentProvider.sendAsync({
        jsonrpc: "2.0",
        method: "eth_signTypedData_v3",
        params: [from, JSON.stringify(data)],
        id: new Date().getTime()
      }, cb);
    } else {
      let send = web3.currentProvider.sendAsync;
      if (!send) send = web3.currentProvider.send;
      send.bind(web3.currentProvider)({
        jsonrpc: "2.0",
        method: "eth_signTypedData_v4",
        params: [from, data],
        from: from,
        id: new Date().getTime()
      }, cb);
    }
  });
}