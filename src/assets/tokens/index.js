import CST from "../images/token_icons/cst-coin.png";
import LMES from "../images/token_icons/LMES.png";
import routerABI from "../ABI/router.ABI.json";
import farmABI from "../ABI/farmABI.json";
import factoryABI from "../ABI/factory.ABI.json";
import pairABI from "../ABI/pair.ABI.json";
import referralsABI from "../ABI/referrals.ABI";
import lotteryABI from "../ABI/lottery.ABI.json";
import NFTABI from "../ABI/NFT.ABI.json";
import tokenABI from "../ABI/tokenContract.ABI.json";
import anchorABI from "../ABI/anchor.ABI.json";
import tokenFactoryABI from "../ABI/tokenFactory.ABI.json";
import clonedTokenABI from "../ABI/tokenABI.json";
export const WETH =
  "https://cronos.org/explorer/testnet3/address/0x417F761CFD4031cE8897724690798778A5470E86/contracts";
export const BURN_ADDRESS = "0x000000000000000000000000000000000000dEaD";
export const ANCHOR_BUSD_LP = "0xC0Ff9f250d2D97F90BC89bD16D3B5344CdC68d06";
export const BNB_BUSD_LP = "0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16";
export const DEFLATIONNARY_TOKENS = [
  "0x1f546ad641b56b86fd9dceac473d1c7a357276b7",
  "0x4aac18De824eC1b553dbf342829834E4FF3F7a9F",
  "0x0ED224e1d088c1BA17BdF352D4FaF0979E7BB0b7",
];
// export const OVERVIEW_LINK =
//   "https://bscscan.com/token/0x4aac18De824eC1b553dbf342829834E4FF3F7a9F";
// export const TOKEN_LINK =
//   "https://bscscan.com/address/0x4aac18De824eC1b553dbf342829834E4FF3F7a9F";
// export const BUSD_LP =
//   "https://bscscan.com/address/0xC0Ff9f250d2D97F90BC89bD16D3B5344CdC68d06";
// export const BNB_LP =
//   "https://bscscan.com/address/0x942986B6Cbe26a80a5456D5d3Ac75860f0E9546e";
// export const TUTORIALS = "https://docs.anchorswap.finance/tutorial";
// export const AUTOMATIC_LIQUIDITY =
//   "https://docs.anchorswap.finance/tokenomics/#automatic-liquidity";
// export const LOTTERY = "https://docs.anchorswap.finance/products/#lottery";
// export const ROADMAP = "https://docs.anchorswap.finance/roadmap/#roadmap";
// export const AUTOMATIC_BURNING =
//   "https://docs.anchorswap.finance/tokenomics/#automatic-burning";
// export const HARVEST_LOCKUP =
//   "https://docs.anchorswap.finance/tokenomics/#harvest-lockup";
// export const ANTI_WHALE =
//   "https://docs.anchorswap.finance/tokenomics/#anti-whale";

export const TOKEN_LIST = [
  {
    icon: LMES,
    name: "LMS",
    address: "0x63A40eeD7777ea5f3b10C01c76b2804734B99848", //BNB
    isAdd: false,
    isDel: false,
    decimals: 18,
    symbol: "LMS",
  },
  {
    icon: CST,
    name: "CST",
    address: "0xFd15391376F5beFF2edb37009c36f8908d7404A0",
    isAdd: false,
    isDel: false,
    decimals: 18,
    symbol: "CST",
  },
  {
    icon: LMES,
    name: "ADF",
    address: "0x788dD0D424B567eBECeB2cF5dAaFF481F45fa304",
    isAdd: false,
    isDel: false,
    decimals: 18,
    symbol: "ADF",
  },
  {
    icon: LMES,
    name: "MBG",
    address: "0xFA75E50cC065aF3a843600ADA783bd7aDf7C01Af",
    isAdd: false,
    isDel: false,
    decimals: 18,
    symbol: "MBG",
  },
];

export const MAIN_CONTRACT_LIST = {
  lottary: {
    address: "0x046d6858b886008807c629CF8f21E3d53a72EeBE",
    blockNumber: 10161850,
    abi: lotteryABI,
  },
  NFT: {
    address: "0x223B44b2305A0D8dd71Ee6620b88fa5f9BC89555",
    blockNumber: 10161804,
    abi: NFTABI,
  },
  farm: {
    address: "0x23f7F3119d1b5b6c94a232680e2925703C4ebbF5",
    blockNumber: 10004492,
    abi: farmABI,
  },
  pool: {
    address: "",
    abi: "",
    blockNumber: 0,
  },
  router: {
    address: "0xA6939d742745fe7fB37a30c5b7F04D7ca75384Ac", //Cronos
    address2: "0xF945c591E61427FF7929F064F389B8C0cd2c16cA", // Binance
    address3: "0xd3d4Ed4335d75d6Df2ca04575467013317E01FeE", // Alvalanche
    blockNumber: 3089767,
    abi: routerABI,
  },
  factory: {
    address: "0x5a27dc2f6e3b84890e6fe568c6bd60a309f048bb", //Cronos
    address2: "0xf538a2519ccbbd6114bfec3e35f0be93afaa6c16", // Binance
    address3: "0xd341f8c00562d2ad534224aa37a27a5120eb7f3e", // Alvalanche
    blockNumber: 3089684,
    abi: factoryABI,
  },
  pair: {
    address: "0x4f6f809d1b30b13676768F5894C32D4136ff27Ea",
    blockNumber: 0,
    abi: pairABI,
  },
  referrals: {
    address: "0x42da818171a8b58A98771F4b99Ea0175f9f7BFc7",
    blockNumber: 10004593,
    abi: referralsABI,
  },
  anchor: {
    address: "0x4aac18De824eC1b553dbf342829834E4FF3F7a9F",
    blockNumber: 10004070,
    abi: tokenABI,
  },
  anchorNew: {
    address: "0x263c5C33e4C780B3e67BA1C4115027d47B3Bb84b",
    blockNumber: 10350461,
    abi: anchorABI,
  },
  tokenFactory: {
    address: "0x25aDa3572390E2e76b177B4b0Ee562c688d313Cc", //cronos
    address1: "0xfbB39a1797ce18Cf66B271E6Aa5F384FA28C145C", //binance
    address2: "0xC3683a866a4690092E57dD92dA2F760CeFEb087C", //alvalanche
    blockNumber: 68765876,
    abi: tokenFactoryABI,
  },
  clonedToken: {
    address: "0x00000000000000000000000000000000000000000",
    blockNumber: 131313,
    abi: clonedTokenABI,
  },
};

export const INIT_VAL = {
  TOKEN_1: TOKEN_LIST[0].symbol,
  TOKEN_2: "Select a token",
};
