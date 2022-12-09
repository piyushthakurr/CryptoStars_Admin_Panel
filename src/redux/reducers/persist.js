import { TOKEN_LIST } from "../../assets/tokens";
import {
  empty,
  getTokenListDiff,
  isAddr,
  notEmpty,
  notEqual,
  rEqual,
} from "../../services/utils";
import { actionTypes } from "../actions/PersistActions";
console.log("tokeeeeee", TOKEN_LIST);
const initialState = {
  walletType: "Metamask",
  priAccount: "",
  isConnected: !1,
  isUserConnected: "",
  tokenList: [],
  tokenListTempo: [],
  slippagePercentage: 1,
  deadline: 20,
  userInfo: "",
  loggedIn: false,
  userLpTokens: [],
  recentTransactions: [],
  referralAddress: "",
  updateUserLpTokens: false,
  anchorValue: "0.01",
  // networkid: 338,
};

const persist = (state = initialState, action) => {
  const token = action.payload;
  // const tList = initialState.tokenList;
  const tList = [...state.tokenList];
  let list = [];
  let idx = -1;
  switch (action.type) {
    case actionTypes.USER_CONNECTED:
      console.log("persisting:", action.payload);
      return {
        ...state,
        priAccount: action.payload.account,
        isConnected: isAddr(action.payload.account),
        isUserConnected: action.payload.account,
        walletType: action.payload.walletType,
      };

    case actionTypes.TOKEN_LIST_ADD:
      console.log("...state.tokenListTempo111111111");
      // const list = tList.filter(t=> rEqual(t.addr, token.addr));
      list = tList.filter((t) => rEqual(t.address, token.address));
      // check if already in the list
      if (empty(list)) {
        // token not in the list
        return {
          ...state,
          tokenList: [...state.tokenList, token],
          tokenListTempo: [...state.tokenListTempo, token],
        };
      }
      return state;

    case actionTypes.TOKEN_LIST_ADD_TOKENS:
      console.log("tokenListTempo2222222222");
      return {
        ...state,
        tokenList: [
          ...state.tokenList,
          ...getTokenListDiff(action.payload, state.tokenList),
        ],
        tokenListTempo: [
          ...state.tokenList,
          ...getTokenListDiff(action.payload, state.tokenList),
        ],
      };
    case actionTypes.TOKEN_SHOW_REMOVE:
      console.log("tokenListTempo333333333");
      idx = tList.findIndex((t) => rEqual(t.address, token.address));
      // check if already in the list
      console.log("found token at:", idx, token, tList);
      if (notEqual(idx, -1)) {
        tList[idx].showAdd = !1;
        state.tokenListTempo[idx].showAdd = !1;
        return {
          ...state,
          tokenList: [...state.tokenList],
          tokenListTempo: [...state.tokenListTempo],
        };
      }
      return state;
    case actionTypes.TOKEN_LIST_ADD_TEMPO:
      console.log("tokenListTempo4444444444444");
      console.log("listUUUUUUUUU!!!!!!!!!!");
      list = tList.filter((t) => rEqual(t.address, token.address));
      // check if already in the list
      console.log("listUUUUUUUUU", list);
      if (empty(list)) {
        // token not in the list
        return {
          ...state,
          tokenListTempo: [...state.tokenListTempo, token],
        };
      }
      return state;
    case actionTypes.TOKEN_LIST_UPDATE_TEMPO:
      console.log("TOKEN_LIST_UPDATE_TEMPO");
      // check if already in the list
      // const nwChangeId = localStorage.getItem("staticNwId");
      // let tempArray = [...action.payload]
      // tempArray = tempArray.filter((obj)=>{
      //   return obj.nwChangeId == nwChangeId
      // })
      if (empty(list)) {
        // token not in the list
        console.log("tokenListTempo55555555", ...action.payload);
        return {
          ...state,
          tokenListTempo: [...action.payload],
        };
      }
      return state;

    case actionTypes.TOKEN_LIST_DEL:
      console.log("tokenListTempo66666666666");
      idx = action.payload;
      let tokenListTempo = [...state.tokenListTempo];
      tList.splice(idx, 1);
      tokenListTempo.splice(idx, 1);
      return {
        ...state,
        tokenList: [...tList],
        tokenListTempo: [...tokenListTempo],
      };
    case actionTypes.SAVE_SLIPPAGE_PERCENTAGE:
      return {
        ...state,
        slippagePercentage: action.payload,
      };
    case actionTypes.SAVE_DEADLINE:
      return {
        ...state,
        deadline: action.payload,
      };
    case actionTypes.LOGIN_USER_SUCCESS:
      return {
        ...state,
        userInfo: action.payload,
        loggedIn: true,
      };
    case actionTypes.SAVE_USER_LP_TOKENS:
      return {
        ...state,
        userLpTokens: action.payload,
      };
    case actionTypes.SAVE_USER_RECENT_TRANSACTIONS:
      return {
        ...state,
        recentTransactions: action.payload.recentTransactions,
      };
    case actionTypes.LOGOUT:
      return initialState;
    case actionTypes.SAVE_REFFRAL_ADDRESS:
      return {
        ...state,
        referralAddress: action.payload,
      };
    case actionTypes.CHECK_USER_LPTOKENS:
      return {
        ...state,
        updateUserLpTokens: action.payload,
      };
    case actionTypes.SAVE_DOLLAR_VALUE:
      return {
        ...state,
        anchorValue: action.payload,
      };
    default:
      return state;
  }
};

export default persist;
