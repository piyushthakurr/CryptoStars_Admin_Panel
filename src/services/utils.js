import { ADDRESS, WALLET_TYPE } from "../constant";
import { LS_KEYS } from "./constants";

const toB64 = (s) => btoa(s);
const eHandle = (e) => e.preventDefault() || !0;
const isArr = (a) => a instanceof Array;
const isObj = (o) => typeof o === "object";
const isStr = (s) => typeof s === "string";
const isNum = (s) => typeof s === "number";

const jObject = (s) => JSON.parse(s);

const jString = (o) => JSON.stringify(o);

function rEqual(a, b) {
  return isStr(a) && isStr(b)
    ? a.toLowerCase() === b.toLowerCase()
    : isNum(a) && isNum(b)
    ? a === b
    : (isStr(a) && isNum(b)) || (isStr(b) && isNum(a))
    ? a == b
    : !1;
}

const notEqual = (a, b) => !rEqual(a, b);

function empty(v) {
  return isStr(v)
    ? rEqual(v.trim().length, 0)
    : isArr(v)
    ? rEqual(v.length, 0)
    : isObj(v)
    ? rEqual(Object.entries(v).length, 0)
    : !1;
}

const isEmpty = empty;

const notEmpty = (v) => !empty(v);
const contains = (s, q) => notEqual(s.toLowerCase().indexOf(q), -1);

const range = (n) =>
  "0"
    .repeat(n)
    .split("")
    .map((_, i) => i + 1);

const sortArr = (arr) => {
  if (arr[0]) {
    if (typeof arr[0] === "string") {
      return arr.sort((a, b) => {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a < b ? 1 : a > b ? -1 : 0;
      });
    } else return arr;
  }
};

function selectText(node) {
  if (document.body.createTextRange) {
    const range = document.body.createTextRange();
    range.moveToElementText(node);
    range.select();
  } else if (window.getSelection) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(node);
    selection.removeAllRanges();
    selection.addRange(range);
  } else {
    console.warn("Could not select text in node: Unsupported browser.");
  }
}

function isAddr(addr) {
  return (
    addr && isStr(addr) && addr.length === 42 && notEqual(addr, ADDRESS.ZERO)
  );
}
const LocalStore = {
  clear: (_) => localStorage.clear(),
  has: (key) => key in localStorage,
  get: (key) => localStorage.getItem(key),
  del: (key) => localStorage.removeItem(key),
  add: (key, value) => localStorage.setItem(key, value),
};

const toHex = (n) =>
  `${n}`.indexOf("0x") > -1 ? n : `0x${Number(n).toString(16)}`;

const truncAddr = (addr) => `${addr.slice(0, 5)}...${addr.slice(38, 42)}`;

const clearEnv = (_) => {
  console.trace("clearing environment..");
  setTimeout((_) => {
    localStorage.clear();
    LocalStore.add(LS_KEYS.WALLET_TYPE, WALLET_TYPE.NONE);
    window.location.reload();
  }, 1000);
};

const isNull = (v) => rEqual(`${v}`, "null");

const notNull = (v) => !isNull(v);

const doPageReload = (delay = 0) =>
  delay
    ? setTimeout((_) => window.location.reload(), delay * 1000)
    : window.location.reload();

const toStr = (v) => (isStr(v) ? v : isObj(v) ? jString(v) : `${v}`);

const isDefined = (v) =>
  notEqual(v, "null") &&
  notEqual(v, null) &&
  notEqual(`${v}`, "undefined") &&
  notEqual(v, undefined);

const notDefined = (v) => !isDefined(v);

const toStd = (v) => Number(v).toLocaleString("fullwide", { useGrouping: !1 });

const truncForUI = (v) => {
  v = `${v}`;
  return v.length >= 12 ? `${v.slice(0, 13)}..` : v;
};

const getWaited = (v) => {
  return notDefined(v) || isEmpty(v) ? "fetching.." : v;
};

// one-level diff
const getTokenListDiff = (a, b) => {
  if (!isArr(a)) a = jObject(a);
  if (!isArr(b)) b = jObject(b);
  return a.filter((n) => !b.filter((m) => rEqual(m.addr, n.addr)).length);
};

export {
  isDefined,
  notDefined,
  getTokenListDiff,
  truncForUI,
  toStr,
  doPageReload,
  empty,
  isNull,
  toStd,
  notNull,
  isAddr,
  rEqual,
  notEqual,
  clearEnv,
  toB64,
  truncAddr,
  isEmpty,
  toHex,
  contains,
  eHandle,
  jObject,
  jString,
  notEmpty,
  range,
  sortArr,
  getWaited,
  LocalStore,
  selectText,
};
