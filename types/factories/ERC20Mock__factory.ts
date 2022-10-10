/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { ERC20Mock, ERC20MockInterface } from "../ERC20Mock";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x60806040523480156200001157600080fd5b506040518060400160405280600981526020017f4d6f636b455243323000000000000000000000000000000000000000000000008152506040518060400160405280600381526020017f4d434b0000000000000000000000000000000000000000000000000000000000815250816003908051906020019062000096929190620000ef565b508060049080519060200190620000af929190620000ef565b505050620000e67fbaedf35cf239cc0b9c06bd161622f22900f060676b3d78b0bbec1f61e30ee37b60001b620000ec60201b60201c565b62000204565b50565b828054620000fd906200019f565b90600052602060002090601f0160209004810192826200012157600085556200016d565b82601f106200013c57805160ff19168380011785556200016d565b828001600101855582156200016d579182015b828111156200016c5782518255916020019190600101906200014f565b5b5090506200017c919062000180565b5090565b5b808211156200019b57600081600090555060010162000181565b5090565b60006002820490506001821680620001b857607f821691505b60208210811415620001cf57620001ce620001d5565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6114db80620002146000396000f3fe608060405234801561001057600080fd5b50600436106100b45760003560e01c806340c10f191161007157806340c10f19146101a357806370a08231146101bf57806395d89b41146101ef578063a457c2d71461020d578063a9059cbb1461023d578063dd62ed3e1461026d576100b4565b806306fdde03146100b9578063095ea7b3146100d757806318160ddd1461010757806323b872dd14610125578063313ce567146101555780633950935114610173575b600080fd5b6100c161029d565b6040516100ce9190610f58565b60405180910390f35b6100f160048036038101906100ec9190610d83565b61032f565b6040516100fe9190610f3d565b60405180910390f35b61010f610352565b60405161011c919061107a565b60405180910390f35b61013f600480360381019061013a9190610d34565b61035c565b60405161014c9190610f3d565b60405180910390f35b61015d61038b565b60405161016a9190611095565b60405180910390f35b61018d60048036038101906101889190610d83565b610394565b60405161019a9190610f3d565b60405180910390f35b6101bd60048036038101906101b89190610d83565b6103cb565b005b6101d960048036038101906101d49190610ccf565b61045d565b6040516101e6919061107a565b60405180910390f35b6101f76104a5565b6040516102049190610f58565b60405180910390f35b61022760048036038101906102229190610d83565b610537565b6040516102349190610f3d565b60405180910390f35b61025760048036038101906102529190610d83565b6105ae565b6040516102649190610f3d565b60405180910390f35b61028760048036038101906102829190610cf8565b6105d1565b604051610294919061107a565b60405180910390f35b6060600380546102ac906111aa565b80601f01602080910402602001604051908101604052809291908181526020018280546102d8906111aa565b80156103255780601f106102fa57610100808354040283529160200191610325565b820191906000526020600020905b81548152906001019060200180831161030857829003601f168201915b5050505050905090565b60008061033a610658565b9050610347818585610660565b600191505092915050565b6000600254905090565b600080610367610658565b905061037485828561082b565b61037f8585856108b7565b60019150509392505050565b60006012905090565b60008061039f610658565b90506103c08185856103b185896105d1565b6103bb91906110cc565b610660565b600191505092915050565b6103f77f30be8efd51811befd022a805458f38e3844c74ad4e8d6aa36fbb4b97ef40662c60001b610b38565b6104237f52f1f6e0d93955928faba4a221edd23af008d30847977637fada6c6b3e2adb0360001b610b38565b61044f7ff51d1f32d27c4af46ee29c3c7c4d06aed7ceb663a8784b523ff2d905cdda36c260001b610b38565b6104598282610b3b565b5050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546104b4906111aa565b80601f01602080910402602001604051908101604052809291908181526020018280546104e0906111aa565b801561052d5780601f106105025761010080835404028352916020019161052d565b820191906000526020600020905b81548152906001019060200180831161051057829003601f168201915b5050505050905090565b600080610542610658565b9050600061055082866105d1565b905083811015610595576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161058c9061103a565b60405180910390fd5b6105a28286868403610660565b60019250505092915050565b6000806105b9610658565b90506105c68185856108b7565b600191505092915050565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614156106d0576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016106c79061101a565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610740576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161073790610f9a565b60405180910390fd5b80600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9258360405161081e919061107a565b60405180910390a3505050565b600061083784846105d1565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146108b157818110156108a3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161089a90610fba565b60405180910390fd5b6108b08484848403610660565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610927576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161091e90610ffa565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610997576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161098e90610f7a565b60405180910390fd5b6109a2838383610c9b565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610a28576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610a1f90610fda565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550816000808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610abb91906110cc565b925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610b1f919061107a565b60405180910390a3610b32848484610ca0565b50505050565b50565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415610bab576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610ba29061105a565b60405180910390fd5b610bb760008383610c9b565b8060026000828254610bc991906110cc565b92505081905550806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254610c1e91906110cc565b925050819055508173ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610c83919061107a565b60405180910390a3610c9760008383610ca0565b5050565b505050565b505050565b600081359050610cb481611477565b92915050565b600081359050610cc98161148e565b92915050565b600060208284031215610ce157600080fd5b6000610cef84828501610ca5565b91505092915050565b60008060408385031215610d0b57600080fd5b6000610d1985828601610ca5565b9250506020610d2a85828601610ca5565b9150509250929050565b600080600060608486031215610d4957600080fd5b6000610d5786828701610ca5565b9350506020610d6886828701610ca5565b9250506040610d7986828701610cba565b9150509250925092565b60008060408385031215610d9657600080fd5b6000610da485828601610ca5565b9250506020610db585828601610cba565b9150509250929050565b610dc881611134565b82525050565b6000610dd9826110b0565b610de381856110bb565b9350610df3818560208601611177565b610dfc8161123a565b840191505092915050565b6000610e146023836110bb565b9150610e1f8261124b565b604082019050919050565b6000610e376022836110bb565b9150610e428261129a565b604082019050919050565b6000610e5a601d836110bb565b9150610e65826112e9565b602082019050919050565b6000610e7d6026836110bb565b9150610e8882611312565b604082019050919050565b6000610ea06025836110bb565b9150610eab82611361565b604082019050919050565b6000610ec36024836110bb565b9150610ece826113b0565b604082019050919050565b6000610ee66025836110bb565b9150610ef1826113ff565b604082019050919050565b6000610f09601f836110bb565b9150610f148261144e565b602082019050919050565b610f2881611160565b82525050565b610f378161116a565b82525050565b6000602082019050610f526000830184610dbf565b92915050565b60006020820190508181036000830152610f728184610dce565b905092915050565b60006020820190508181036000830152610f9381610e07565b9050919050565b60006020820190508181036000830152610fb381610e2a565b9050919050565b60006020820190508181036000830152610fd381610e4d565b9050919050565b60006020820190508181036000830152610ff381610e70565b9050919050565b6000602082019050818103600083015261101381610e93565b9050919050565b6000602082019050818103600083015261103381610eb6565b9050919050565b6000602082019050818103600083015261105381610ed9565b9050919050565b6000602082019050818103600083015261107381610efc565b9050919050565b600060208201905061108f6000830184610f1f565b92915050565b60006020820190506110aa6000830184610f2e565b92915050565b600081519050919050565b600082825260208201905092915050565b60006110d782611160565b91506110e283611160565b9250827fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff03821115611117576111166111dc565b5b828201905092915050565b600061112d82611140565b9050919050565b60008115159050919050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000819050919050565b600060ff82169050919050565b60005b8381101561119557808201518184015260208101905061117a565b838111156111a4576000848401525b50505050565b600060028204905060018216806111c257607f821691505b602082108114156111d6576111d561120b565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000601f19601f8301169050919050565b7f45524332303a207472616e7366657220746f20746865207a65726f206164647260008201527f6573730000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f766520746f20746865207a65726f20616464726560008201527f7373000000000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000600082015250565b7f45524332303a207472616e7366657220616d6f756e742065786365656473206260008201527f616c616e63650000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a207472616e736665722066726f6d20746865207a65726f20616460008201527f6472657373000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a20617070726f76652066726f6d20746865207a65726f2061646460008201527f7265737300000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760008201527f207a65726f000000000000000000000000000000000000000000000000000000602082015250565b7f45524332303a206d696e7420746f20746865207a65726f206164647265737300600082015250565b61148081611122565b811461148b57600080fd5b50565b61149781611160565b81146114a257600080fd5b5056fea2646970667358221220b397262111cd892ae318ca23263d647cd24db1b77c62ffae33ba5f9de9cac50a64736f6c63430008040033";

export class ERC20Mock__factory extends ContractFactory {
  constructor(
    ...args: [signer: Signer] | ConstructorParameters<typeof ContractFactory>
  ) {
    if (args.length === 1) {
      super(_abi, _bytecode, args[0]);
    } else {
      super(...args);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ERC20Mock> {
    return super.deploy(overrides || {}) as Promise<ERC20Mock>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): ERC20Mock {
    return super.attach(address) as ERC20Mock;
  }
  connect(signer: Signer): ERC20Mock__factory {
    return super.connect(signer) as ERC20Mock__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): ERC20MockInterface {
    return new utils.Interface(_abi) as ERC20MockInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): ERC20Mock {
    return new Contract(address, _abi, signerOrProvider) as ERC20Mock;
  }
}
