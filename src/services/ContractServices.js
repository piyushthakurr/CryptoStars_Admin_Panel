import Web3 from "web3";
import TOKEN_ABI from "../assets/ABI/tokenContract.ABI.json";
import { toast } from "../Components/Toast/Toast";
import {
  EVENTS,
  NETWORK_CHAIN_NAME,
  NETWORK_LINK,
  NETWORK_NATIVE_CURRENCY_DECIMALS,
  NETWORK_NATIVE_CURRENCY_NAME,
  NETWORK_NATIVE_CURRENCY_SYMBOL,
  NETWORK_RPC_URL,
  STR_CONSTANT,
  WALLET_METH,
  WALLET_TYPE,
} from "../constant";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { clearEnv, isDefined, LocalStore, rEqual, toHex, toStd } from "./utils";
import { notEqual } from "assert";
import { LS_KEYS } from "./constants";
import { WalletService } from "./WalletServices";
import { MAIN_CONTRACT_LIST } from "../assets/tokens";

let web3Object;
let contractOjbect;
let currentContractAddress;
let tokenContractObject;
let currentTokenAddress;
const wType = LocalStore.get(LS_KEYS.WALLET_TYPE);
let walletTypeObject = wType || WALLET_TYPE.NONE;
let walletConnectProvider;

//only for lp tokens
const convertToDecimals = async (value) => {
  const decimals = 18;
  return Number(value) / 10 ** decimals;
};

const isMetamaskInstalled = async (type) => {
  console.log("[isMetamaskInstalled] TYPE from ContractServices", type);
  //Have to check the ethereum binding on the window object to see if it's installed
  const { ethereum, web3 } = window;
  if (Boolean(ethereum && ethereum.isMetaMask)) {
    //metamask
    try {
      const chainId = ethereum.networkVersion;
      const nwChangeId = localStorage.getItem("staticNwId");

      if (!rEqual(toHex(chainId), toHex(nwChangeId))) {
        // switch network request
        try {
          console.log("contractservices");
          await WalletService.requestChainChangeDefault();
        } catch (e) {
          console.log("chain change request resulted into an error:", e);
          toast.error(STR_CONSTANT.NETWORK_INVALID);
          clearEnv();
          return null;
        }
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  } else if (ethereum) {
    //trust wallet
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      return accounts[0];
    } catch (err) {
      toast.error(err.message);
      return null;
    }
  } else if (web3) {
    //trustwallet
    const accounts = await web3.eth.getAccounts();
    return accounts[0];
  } else {
    if (type) {
      toast.error(`Install ${type} extension first!`);
    }
    return null;
  }
};

//Network switch protection

const callWeb3 = (_) => {
  if (web3Object) {
    return web3Object;
  }
  const { ethereum, web3 } = window;
  console.log("callWeb3 wallet type:", walletTypeObject);
  if (rEqual(walletTypeObject, WALLET_TYPE.METAMASK)) {
    if (ethereum && ethereum.isMetaMask) {
      web3Object = new Web3(ethereum);
      return web3Object;
    } else if (ethereum) {
      web3Object = new Web3(ethereum);
      return web3Object;
    } else if (web3) {
      web3Object = new Web3(web3.currentProvider);
      return web3Object;
    } else {
      toast.error("You have to install Wallet!");
    }
  } else {
    toast.error("You have to install Wallet!");
  }
};

const callContract = async (contractAddress, contractABI) => {
  if (
    isDefined(contractOjbect) &&
    isDefined(currentContractAddress) &&
    rEqual(currentContractAddress, contractAddress)
  ) {
    return contractOjbect;
  }
  const web3Object = await callWeb3();
  currentContractAddress = contractAddress;
  contractOjbect = new web3Object.eth.Contract(contractABI, contractAddress);
  return contractOjbect;
};

const callTokenContract = async (tokenAddress) => {
  if (
    isDefined(tokenContractObject) &&
    isDefined(currentContractAddress) &&
    rEqual(currentTokenAddress, tokenAddress)
  ) {
    return tokenContractObject;
  }
  const web3Object = await callWeb3();
  currentTokenAddress = tokenAddress;
  tokenContractObject = new web3Object.eth.Contract(
    TOKEN_ABI,
    currentTokenAddress
  );
  return tokenContractObject;
};

const calculateGasPrice = async () => {
  const web3 = await callWeb3();
  return await web3.eth.getGasPrice();
};

const getDefaultAccount = async () => {
  const web3 = await callWeb3();
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

const approveToken = async (
  address,
  value,
  mainContractAddress,
  tokenAddress
) => {
  try {
    const gasPrice = await calculateGasPrice();
    const contract = await callTokenContract(tokenAddress);
    //calculate estimate gas limit
    const gas = await contract.methods
      .approve(mainContractAddress, value)
      .estimateGas({ from: address });

    return await contract.methods
      .approve(mainContractAddress, value)
      .send({ from: address, gasPrice, gas });
  } catch (error) {
    return error;
  }
};

const allowanceToken = async (tokenAddress, mainContractAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    return await contract.methods
      .allowance(address, mainContractAddress)
      .call();
  } catch (error) {
    return error;
  }
};

const getTokenBalance = async (tokenAddress, address) => {
  try {
    return new Promise((r, j) => {
      callTokenContract(tokenAddress)
        .then((c) => {
          c.methods
            .decimals()
            .call()
            .then((dec) => {
              c.methods
                .balanceOf(address)
                .call()
                .then((bal) => r(Number((Number(bal) / 10 ** dec).toFixed(5))))

                .catch((e) => j(e));
            })
            .catch((e) => j(e));
        })
        .catch((e) => j(e));
    });
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
};
const getTokenBalanceFull = async (tokenAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    console.log("contract", contract);
    const decimals = await contract.methods.decimals().call();

    console.log("decimal", decimals);
    let result = await contract.methods.balanceOf(address).call();
    result = result / 10 ** decimals;
    console.log("www", result);
    return result;
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
};

const getDecimals = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    return await contract.methods.decimals().call();
  } catch (error) {
    return error;
  }
};

const getTokenName = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    return await contract.methods.name().call();
  } catch (error) {
    return error;
  }
};

const getTokenSymbol = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    return await contract.methods.symbol().call();
  } catch (error) {
    return error;
  }
};

const getBNBBalance = async (address) => {
  try {
    const web3 = await callWeb3();
    let result = await web3.eth.getBalance(address);
    result = (Number(result) / 10 ** 18).toFixed(5);
    return Number(result);
  } catch (error) {
    return error;
  }
};

const setWalletType = (walletType) => {
  walletTypeObject = walletType;
};

const getTotalSupply = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    let result = await contract.methods.totalSupply().call();
    const decimals = await contract.methods.decimals().call();
    result = Number(result) / 10 ** Number(decimals);
    return result;
  } catch (error) {
    return error;
  }
};

const getInitialSupply = async (tokenAddress) => {
  try {
    const contract = await callTokenContract(tokenAddress);
    let result = await contract.methods.initialSupply().call();
    const decimals = await contract.methods.decimals().call();
    result = Number(result) / 10 ** Number(decimals);
    return result;
  } catch (error) {
    return error;
  }
};

const web3ErrorHandle = async (err) => {
  let message = "Transaction Reverted!";
  if (err.message.indexOf("Rejected") > -1) {
    message = "User denied the transaction!";
  } else if (err.message && err.message.indexOf("User denied") > -1) {
    message = "User denied the transaction!";
  } else if (err.message && err.message.indexOf("INSUFFICIENT_B") > -1) {
    message = "Insufficient value of second token!";
  } else if (err.message && err.message.indexOf("INSUFFICIENT_A") > -1) {
    message = "Insufficient value of first token!";
  } else {
    console.log(err, err.message);
  }
  return message;
};

const getLiquidity100Value = async (tokenAddress, address) => {
  try {
    const contract = await callTokenContract(tokenAddress);

    return await contract.methods.balanceOf(address).call();
  } catch (error) {
    console.log("Error:", error);
    return error;
  }
};

const callWeb3ForWalletConnect = async (provider) => {
  const provide = new WalletConnectProvider({
    //infuraId: "8570afa4d18b4c5d9cb3a629b08de069",
    rpc: {
      97: "https://data-seed-prebsc-2-s3.binance.org:8545/",
      56: "https://bsc-dataseed.binance.org/",
    },
    chainId: 97,
    network: "binance",
    qrcode: true,
    qrcodeModalOptions: {
      mobileLinks: [
        "rainbow",
        "metamask",
        "argent",
        "trust",
        "imtoken",
        "pillar",
      ],
      desktopLinks: ["encrypted ink"],
    },
  });
  const results = await provide.enable();
  walletConnectProvider = provide;
  web3Object = new Web3(provide);

  // return instance;
};

const isAdminAccount = async (account) => {
  const router = await callContract(
    MAIN_CONTRACT_LIST.router.address,
    MAIN_CONTRACT_LIST.router.abi
  );
  const admin = await router.methods.starOwner().call();
  return (
    rEqual(account, admin) ||
    rEqual(account, "0xad9d8be72aBdc7f7D2BFF181c327b29402894E23")
  );
};

const burnToken = async (amount, addr, from) => {
  return new Promise((r, j) => {
    callTokenContract(addr)
      .then(async (c) => {
        const dec = await getDecimals(addr);
        amount = toStd(amount * 10 ** dec);
        c.methods
          .burn(amount)
          .estimateGas({ from })
          .then((gas) => {
            c.methods
              .burn(amount)
              .send({ from, gas })
              .then((hash) => r(hash))
              .catch((e) => j(e));
          })
          .catch((e) => j(e));
      })
      .catch((e) => j(e));
  });
};

//exporting functions
export const ContractServices = {
  isAdminAccount,
  isMetamaskInstalled,
  web3Object,
  callWeb3,
  burnToken,
  callContract,
  calculateGasPrice,
  approveToken,
  getTokenBalance,
  getTokenBalanceFull,
  getDecimals,
  getTokenName,
  getInitialSupply,
  getTokenSymbol,
  getBNBBalance,
  setWalletType,
  allowanceToken,
  getTotalSupply,
  convertToDecimals,
  web3ErrorHandle,
  getDefaultAccount,
  callTokenContract,
  walletTypeObject,
  getLiquidity100Value,
  callWeb3ForWalletConnect,
};
