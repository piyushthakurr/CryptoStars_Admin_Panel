import { toHex } from "./services/utils";

export const HOME_ROUTE = process.env.REACT_APP_HOME_ROUTE;
export const API_HOST = process.env.REACT_APP_API_URL;
export const CAPTCHA_KEY = process.env.REACT_APP_GOOGLE_CAPTCHA_KEY;
export const BSC_SCAN = "https://testnet.cronoscan.com/";
export const NETWORK_CHAIN_NAME = process.env.REACT_APP_NETWORK_CHAIN_NAME;
export const NETWORK_RPC_URL = process.env.REACT_APP_NETWORK_RPC_URL;
export const NETWORK_LINK = process.env.REACT_APP_NETWORK_LINK;
export const NETWORK_VERSION = process.env.REACT_APP_NETWORK_VERSION;
export const NETWORK_CHAIN_ID = 338;
export const NETWORK_NATIVE_CURRENCY_NAME =
  process.env.REACT_APP_NETWORK_NATIVE_CURRENCY_NAME;
export const NETWORK_NATIVE_CURRENCY_SYMBOL =
  process.env.REACT_APP_NETWORK_NATIVE_CURRENCY_SYMBOL;
export const NETWORK_NATIVE_CURRENCY_DECIMALS =
  process.env.REACT_APP_NETWORK_NATIVE_CURRENCY_DECIMALS;
export const globalResErrMsg = "Woops something went wrong, Please try again.";
export const SUCCESS_200 = 200;
export const BAD_REQUEST = 400;
export const UNAUTHORISED = 401;
export const AUTH_TOKEN_KEY = "api-access-token";
export const PASSPORT_FRONT = 0;
export const PASSPORT_BACK = 4;
export const LICENSE_FRONT = 2;
export const LICENSE_BACK = 3;
export const NATIONAL_ID = 1;
export const KYC_SUBMITTED = 0;
export const KYC_APPROVED = 1;
export const KYC_DECLINED = 2;
export const KYC_RE_SUBMITTED = 3;
export const LIQUIDITY_PROVIDER_FEE = 0.2;
export const DOCS_LINK = "https://docs.anchorswap.finance";
export const TWITTER_LINK = "https://twitter.com/AnchorSwap";
export const TELEGRAM_LINK = "https://t.me/joinchat/KP-_HKro73ViZTZk";
export const AUDIT_LINK = "https://docs.anchorswap.finance/audit/";

export const VAL_CONSTANT = {
  PROJECT_ID: "admin_panel",
  MAX_256: "0x" + "f".repeat(64),
  RETRIEVE_TOKEN_LIST_REQ_DELAY: 2 * 1000, // ms
  MAX_256_DEC_10_18:
    "115792089237316195423570985008687907853269984665640564039457",
};

export const URL = {
  CRONOS_EXPLORER: "https://testnet.cronoscan.com",
  BNB_EXPLORER: "https://testnet.bscscan.com/",
  AVA_EXPLORER: "https://testnet.snowtrace.io",
  // API_BACKEND: "http://127.0.0.1:8448",
  API_BACKEND: "https://admin-staging.crypto-stars.net",
};

export const ADDRESS = {
  ZERO: `0x${"0".repeat(40)}`,
};

export const EVENTS = {
  CHAIN_CHANGED: "chainChanged",
  ACC_CHANGED: "accountsChanged",
};

export const WALLET_METH = {
  ADD_CHAIN: "wallet_addEthereumChain",
  SWITCH_CHAIN: "wallet_switchEthereumChain",
};

export const WALLET_TYPE = {
  NONE: "none",
  METAMASK: "metamask",
  W_CONNECT: "wallet-connect",
};

export const STR_CONSTANT = {
  NETWORK_INVALID: "pls select cronos network",
  WALLET_INVALID: "invalid wallet",
  TOKEN_ALREADY: "already selected",
  DEF_CURRENCY_SYM: "Select a token",
  NOT_AN_ADMIN: "You are not an admin!",
  CONNECT_WALLET_AGAIN: "pls connect wallet again",
  CONNECT_WALLET: "Connect wallet first!",
  TOKEN_SIMILAR: "please select dissimilar tokens",
};

export const TOKEN = {
  A: 1,
  B: 2,
  BOTH: 0,
};

export const isMetamakConnected = async () => {
  const { ethereum } = window;
  const result = Boolean(ethereum && ethereum.isMetaMask);
  try {
    if (result) {
      const chain = await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(NETWORK_CHAIN_ID) }],
      });
      return true;
    } else {
      window.alert(`Install Metamask extension first!`);
      window.open("https://metamask.io/", "_blank");
      return false;
    }
  } catch (error) {
    if (error?.code === 4902) {
      try {
        const addChain = await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: await window.ethereum.chainId,
              chainName: NETWORK_CHAIN_NAME,
              nativeCurrency: {
                name: NETWORK_NATIVE_CURRENCY_NAME,
                symbol: NETWORK_NATIVE_CURRENCY_SYMBOL,
                decimals: Number(NETWORK_NATIVE_CURRENCY_DECIMALS),
              },
              rpcUrls: [NETWORK_RPC_URL],
              blockExplorerUrls: [NETWORK_LINK],
            },
          ],
        });

        return true;
      } catch (error) {
        return false;
      }
    }
    if (error?.code === 4001) {
      return false;
    }
    throw error;
  }
};

export const addCommas = (nStr) => {
  nStr += "";
  let x = nStr.split(".");
  let x1 = x[0];
  let x2 = x.length > 1 ? "." + x[1] : "";
  let rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, "$1" + "," + "$2");
  }
  return x1 + x2;
};
