import { useSelector } from "react-redux";
import { ContractServices } from "../services/ContractServices";
import {
  contains,
  getTokenListDiff,
  isAddr,
  isNull,
  jObject,
  jString,
  LocalStore,
  notEmpty,
  rEqual,
} from "../services/utils";
import default_icon from "../assets/images/token_icons/default.svg";
import { useDispatch } from "react-redux";
import {
  tokenListAdd,
  tokenListAddTokens,
  tokenListDel,
  updateTokenListTempo,
} from "../redux/actions";
import { useEffect, useRef } from "react";
import { LS_KEYS } from "../services/constants";
import { retrieveTokenListCall } from "../services/api";
import { URL, VAL_CONSTANT } from "../constant";

window.interval = null;

const useCommonHook = (_) => {
  const dispatch = useDispatch();
  const persist = useSelector((state) => state.persist);
  const nwChangeId = localStorage.getItem("staticNwId");

  const updateTokenList = (list) => {
    console.log("updateTokenList with:", [...list]);
    let tokenList = [];
    const addTokenToList = async (i) => {
      if (rEqual(i, list.length)) {
        await dispatch(tokenListAddTokens([]));
        tokenList.length && dispatch(tokenListAddTokens(tokenList));
        return;
      }
      resolveToken(list[i])
        .then((token) => {
          tokenList.push(token);
          addTokenToList(i + 1);
        })
        .catch((e) => {
          throw e;
        });
    };
    list.length && addTokenToList(0);
  };

  async function resolveToken(token) {
    console.log("token12345", token);
    const icon = URL.API_BACKEND + "/uploads/" + token.icon;
    const dec = await ContractServices.getDecimals(token.addr);
    const name = await ContractServices.getTokenName(token.addr);
    const sym = await ContractServices.getTokenSymbol(token.addr);
    const bal = await ContractServices.getTokenBalance(
      token.addr,
      persist.priAccount
    );

    return {
      name,
      icon,
      isAdded: !0,
      showAdd: !1,
      symbol: sym,
      balance: bal,
      decimals: dec,
      address: token.addr,
      nwChangeId: nwChangeId,
    };
  }

  async function searchTokenByNameOrAddress(query, priAccount) {
    let tokenList = persist.tokenList;
    if (notEmpty(query)) {
      const list = tokenList.filter((t) => contains(t.symbol, query));
      console.log("list:", list, query, tokenList);
      await dispatch(updateTokenListTempo([]));
      if (notEmpty(list)) {
        dispatch(updateTokenListTempo(list));
      } else {
        dispatch(updateTokenListTempo([]));
      }
    } else dispatch(updateTokenListTempo(tokenList));
  }

  async function delTokenFromList(token) {
    const tokenList = persist.tokenList;
    const idx = tokenList.findIndex((t) => rEqual(t.address, token.address));
    if (idx > -1) return dispatch(tokenListDel(idx));
    console.log("token not found!");
  }

  async function addTokenToList(token) {
    const tokenList = persist.tokenList;
    const idx = tokenList.findIndex((t) => rEqual(t.address, token.address));
    if (rEqual(idx, -1)) return dispatch(tokenListAdd(token));
    console.log("token already added!");
  }

  function init() {
    // LocalStore.del(LS_KEYS.TOKEN_LIST);
    retrieveTokenListCall().then((res) => {
      console.log("init_retrieveTokenList", res);
      updateTokenList(res);
      LocalStore.add(LS_KEYS.TOKEN_LIST, jString(res));
    });
    if (isNull(window.interval)) {
      window.interval = setInterval((_) => {
        retrieveTokenListCall().then((res) => {
          const tListStr = LocalStore.get(LS_KEYS.TOKEN_LIST);
          console.log("res", res);
          // console.log("tListStr", tListStr);
          try {
            // if (isNull(tListStr)) {
            //   console.log("Ifcondition");
            //   // updateTokenList(res);
            // } else
            if (getTokenListDiff(res, jObject(tListStr)) != 0) {
              console.log("elseCondition");
              updateTokenList(getTokenListDiff(res, jObject(tListStr)));
              LocalStore.add(LS_KEYS.TOKEN_LIST, jString(res));
            }
          } catch (e) {}
        });
      }, VAL_CONSTANT.RETRIEVE_TOKEN_LIST_REQ_DELAY);
    }
  }

  return {
    init,
    addTokenToList,
    delTokenFromList,
    searchTokenByNameOrAddress,
  };
};

export default useCommonHook;
