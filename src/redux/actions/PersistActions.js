import packageJson from "../../../package.json";
import { WALLET_TYPE } from "../../constant";
import { ContractServices } from "../../services/ContractServices";

/* seting action types */
export const actionTypes = {
  USER_CONNECTED: "USER_CONNECTED",
  LOGOUT: "LOGOUT",
  TOKEN_SHOW_REMOVE: "TOKEN_SHOW_REMOVE",
  TOKEN_LIST_ADD_TOKENS: "TOKEN_LIST_ADD_TOKENS",
  TOKEN_LIST_ADD: "TOKEN_LIST_ADD",
  TOKEN_LIST_ADD_TEMPO: "TOKEN_LIST_ADD_TEMPO",
  TOKEN_LIST_UPDATE_TEMPO: "TOKEN_LIST_UPDATE_TEMPO",
  TOKEN_LIST_DEL: "TOKEN_LIST_DEL",
  SAVE_SLIPPAGE_PERCENTAGE: "SAVE_SLIPPAGE_PERCENTAGE",
  SAVE_DEADLINE: "SAVE_DEADLINE",
  LOGIN_USER_SUCCESS: "LOGIN_USER_SUCCESS",
  SAVE_USER_LP_TOKENS: "SAVE_USER_LP_TOKENS",
  SAVE_USER_RECENT_TRANSACTIONS: "SAVE_USER_RECENT_TRANSACTIONS",
  SAVE_REFFRAL_ADDRESS: "SAVE_REFFRAL_ADDRESS",
  CHECK_USER_LPTOKENS: "CHECK_USER_LPTOKENS",
  SAVE_DOLLAR_VALUE: "SAVE_DOLLAR_VALUE",
  // SAVE_NETWORK_ID: "SAVE_NETWORK_ID",
};

export const versionManager = () => async (dispatch, getState) => {
  try {
    const version = packageJson.version;
    const react_version = localStorage.getItem("react_version");
    if (react_version && version !== react_version) {
      localStorage.clear();
      window.location.reload();
    }
    if (!react_version) {
      localStorage.setItem("react_version", version);
    }
  } catch (error) {
    console.log(error);
  }
};

/*
 * Action creators
 */
export const login = (data) => {
  return {
    type: actionTypes.USER_CONNECTED,
    payload: data,
  };
};
export const logout = () => {
  return {
    type: actionTypes.LOGOUT,
  };
};
export const tokenListAdd = (token) => {
  return {
    type: actionTypes.TOKEN_LIST_ADD,
    // payload: {...token, isAdd: !1},
    payload: { ...token, showAdd: !0 },
  };
};
export const tokenListTempoAdd = (token) => {
  console.log("tokenListTempoAdd", token);

  return {
    type: actionTypes.TOKEN_LIST_ADD_TEMPO,
    // payload: {...token, isAdd: !1},
    payload: token,
  };
};
export const tokenListAddTokens = (tokenList) => {
  return {
    type: actionTypes.TOKEN_LIST_ADD_TOKENS,
    // payload: {...token, isAdd: !1},
    payload: tokenList,
  };
};
// export const tokenListDel = (token) => {
export const tokenShowRemove = (token) => {
  console.log("[dispatch] tokenShowRemove", token);
  return {
    type: actionTypes.TOKEN_SHOW_REMOVE,
    payload: token,
  };
};
export const tokenListDel = (idx) => {
  console.log("[dispatch] tokenListDel", idx);
  return {
    type: actionTypes.TOKEN_LIST_DEL,
    // payload: {...token, isAdd: true},
    payload: idx,
  };
};
export const updateTokenListTempo = (list) => {
  console.log("[dispatch] updateTokenListTempo", list);
  // list= []
  return {
    type: actionTypes.TOKEN_LIST_UPDATE_TEMPO,
    payload: list,
  };
};
export const saveSlippagePercentage = (data) => {
  return {
    type: actionTypes.SAVE_SLIPPAGE_PERCENTAGE,
    payload: data,
  };
};
export const saveDeadline = (data) => {
  return {
    type: actionTypes.SAVE_DEADLINE,
    payload: data,
  };
};
export const saveUser = (data) => {
  return {
    type: actionTypes.LOGIN_USER_SUCCESS,
    payload: data,
  };
};
export const saveUserLpTokens = (data) => {
  return {
    type: actionTypes.SAVE_USER_LP_TOKENS,
    payload: data,
  };
};
export const checkUserLpTokens = (payload) => {
  return {
    type: actionTypes.CHECK_USER_LPTOKENS,
    payload,
  };
};

export const savereffralAddress = (address) => {
  return {
    type: actionTypes.SAVE_REFFRAL_ADDRESS,
    payload: address,
  };
};

export const addTransaction = (data) => async (dispatch, getState) => {
  let {
    persist: { recentTransactions },
  } = getState();
  recentTransactions.unshift(data);
  dispatch({
    type: actionTypes.SAVE_USER_RECENT_TRANSACTIONS,
    payload: { recentTransactions },
  });
};

export const removeTokenList = (data) => async (dispatch, getState) => {
  let {
    persist: { tokenList },
  } = getState();
  const findIndex = tokenList.findIndex(
    (a) => a.address.toLowerCase() === data.address.toLowerCase()
  );
  const tkList = tokenList.splice(findIndex, 1);
  console.log(tkList);
};

export const saveDollarValue = (data) => {
  return {
    type: actionTypes.SAVE_DOLLAR_VALUE,
    payload: data,
  };
};
