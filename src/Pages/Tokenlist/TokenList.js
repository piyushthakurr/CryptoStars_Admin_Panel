import React, { useEffect, useState } from "react";
import { toast } from "../../Components/Toast/Toast";
import { retreiveTokenList } from "../../services/api";
import { CopyToClipboard } from "react-copy-to-clipboard";
import copyIcon from "../../assets/images/icon_copyAddress.png";

import {
  doPageReload,
  eHandle,
  getWaited,
  isAddr,
  isEmpty,
  notDefined,
  rEqual,
  selectText,
  toB64,
  toStd,
  truncAddr,
  truncForUI,
} from "../../services/utils";
import "./Tokenlist.scss";
import BurnModal from "./BurnModal";
import {
  getTokenBalance,
  startLoading,
  stopLoading,
} from "../../redux/actions";
import { ContractServices } from "../../services/ContractServices";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Button from "../../Components/Button/Button";
import { ADDRESS, URL } from "../../constant";
import { useRef } from "react";
import { deletTokenApiData } from "../../services/api";
import DeleteModal from "./DeleteTokenModal";

export const TokenList = ({ data }) => {
  const dispatch = useDispatch();
  const priAccount = useSelector((s) => s.persist.priAccount);
  const [showBurnModal, setShowBurnModal] = useState(!1);
  const [tokenAddr, setTokenAddr] = useState(ADDRESS.ZERO);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [newTokenListBackend, setNewTokenListBackend] = useState([]);
  const [openModal, setOpenModal] = useState(!1);
  const [tokenId, setTokenId] = useState();
  const localChainId = localStorage.getItem("staticNwId");

  const lock = useRef(!0);

  useEffect(() => {
    if (lock.current) {
      newTokenList();
      lock.current = !1;
    }
  }, []);

  //Fetching list from backend
  const newTokenList = async () => {
    let infoList = await retreiveTokenList();
    console.log(infoList, "tertsweeerre==");
    infoList = infoList.filter((obj) => {
      return obj.nwChangeId == localChainId;
    });

    const fetchInfoOnChain = (i) => {
      if (rEqual(i, infoList.length)) return;
      const addr = infoList[i].addr;
      ContractServices.getTotalSupply(addr).then((ts) => {
        infoList[i]["totalSupply"] = truncForUI(toStd(ts));
        ContractServices.getInitialSupply(addr).then((initS) => {
          infoList[i]["initialSupply"] = truncForUI(toStd(initS));
          ContractServices.getTokenBalance(addr, priAccount).then((bal) => {
            infoList[i]["balance"] = truncForUI(toStd(bal));
            fetchInfoOnChain(i + 1);
          });
        });
      });
    };

    if (infoList.length > 0) {
      dispatch(startLoading());
      fetchInfoOnChain(0);
      console.log("infoList:", infoList);
      setTimeout((_) => {
        dispatch(stopLoading());
        setNewTokenListBackend(infoList);
      }, 5000);
    } else {
      console.log("infoList empty:", infoList);
    }
  };
  const getBalanceOf = async (addr) => {
    const bal = await ContractServices.getTokenBalance(addr, priAccount);
    return bal;
  };

  const performBurnOperation = async (val, addr) => {
    console.log("performing burn op:", val, addr);
    dispatch(startLoading());
    try {
      await ContractServices.burnToken(val, addr, priAccount);
      dispatch(stopLoading());
      setShowBurnModal(!1);
      doPageReload();
      toast.success("burn successful");
    } catch (e) {
      console.log("error", e);
      toast.error("burn unsuccessful, pls try again!");
      dispatch(stopLoading());
    }
  };
  useEffect(
    (_) => {
      console.log("tokenAddr changed:", tokenAddr);
      if (isAddr(tokenAddr)) {
        setShowBurnModal(!0);
      }
    },
    [tokenAddr]
  );

  useEffect(
    (_) => {
      console.log("newTokenListBackend changed to:", newTokenListBackend);
    },
    [newTokenListBackend]
  );

  async function deleteTokenData(data) {
    console.log("delete function call", data);
    setTokenId(data);
    // const resp = await deletTokenApiData(data);
    // window.location.reload();
    // console.log("respppppppppppp", resp);
  }

  async function importTokenFun(data) {
    console.log("Import Token Call", data);
    const connectionVar = window.ethereum;
    const wasAdded = connectionVar.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20", // Initially only supports ERC20, but eventually more!
        options: {
          address: data?.address, // The address that the token is at.
          symbol: data?.symbol, // A ticker symbol or shorthand, up to 5 chars.
          decimals: 18, // The number of decimals in the token
          // image: tokenImage, // A string url of the token logo
        },
      },
    });
  }

  return (
    <div className="token_list container_swapwrap">
      <ul>
        {newTokenListBackend.map(
          (token, i) => (
            console.log("tokenNNNNNNNN", token),
            (
              <div className="token_card" key={token.name}>
                <div className="token_img">
                  <img
                    src={`${URL.API_BACKEND}/uploads/${token.icon}`}
                    alt="icon"
                    height="165"
                    width="165"
                  />
                </div>
                <div className="add_sec">
                  <span>
                    <label htmlFor="html">Token Name</label>
                    <li style={{ color: "white" }}>
                      {token.name.slice(0, 10)}...
                    </li>
                  </span>
                  <span>
                    <label htmlFor="html">Token Symbol</label>
                    <li style={{ color: "white" }}>
                      {token.sym.slice(0, 10)}...
                    </li>
                  </span>
                  <span>
                    <label htmlFor="html">Token Address</label>
                    <div className="trunc_sec">
                      <li id={toB64(token.addr)} style={{ color: "white" }}>
                        {truncAddr(token.addr)}
                      </li>
                      <CopyToClipboard
                        text={token.addr}
                        onCopy={(_) => {
                          selectText(
                            document.querySelector(`#${toB64(token.addr)}`)
                          );
                          toast.success("Copied!");
                        }}
                      >
                        <img
                          className="copy-icon cursor--pointer"
                          src={copyIcon}
                          alt="copy"
                        />
                      </CopyToClipboard>
                    </div>
                  </span>
                  <span>
                    <label htmlFor="html">Balance</label>
                    <li style={{ color: "white" }}>
                      {token.balance || "fetching.."}
                    </li>
                  </span>
                </div>

                <div className="supply_sec">
                  {token.name == "CST" ? (
                    <span>
                      <label htmlFor="html">Initial Supply</label>
                      <li style={{ color: "white" }}>
                        {token.totalSupply || "fetching.."}
                      </li>
                    </span>
                  ) : (
                    <span>
                      <label htmlFor="html">Initial Supply</label>
                      <li style={{ color: "white" }}>
                        {token.initialSupply || "fetching.."}
                      </li>
                    </span>
                  )}
                  <span>
                    <label htmlFor="html">Total Supply</label>
                    <abbr title={token.totalSupply || "fetching.."}>
                      <li style={{ color: "white" }}>
                        {token.totalSupply || "fetching.."}
                      </li>
                    </abbr>
                  </span>
                  <span>
                    <label htmlFor="html">Token Decimal</label>
                    <li style={{ color: "white" }}>{token.dec}</li>
                  </span>
                </div>

                {/* <div className="burn-section">
              <span>
                <label htmlFor="html">Balance</label>
                <li style={{ color: "white" }}>
                  {token.balance || "fetching.."}
                </li>
              </span>
            </div> */}

                <div className="burn-section">
                  {token.name == "CST" ? null : (
                    <div>
                      <Button
                        className="token_list_btn"
                        onClick={() => {
                          deleteTokenData({ id: token.keyId });
                          setOpenModal(!0);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  )}

                  {token.name == "CST" ? null : (
                    <div>
                      <Button
                        className="token_list_btn"
                        onClick={async (e) => {
                          eHandle(e);
                          const bal = await getBalanceOf(token.addr);
                          setTokenBalance(bal);
                          setTokenAddr(token.addr);
                        }}
                      >
                        Burn
                      </Button>
                    </div>
                  )}
                  <div>
                    <Button
                      className="token_list_btn"
                      onClick={() =>
                        importTokenFun({
                          address: token.addr,
                          symbol: token.sym,
                        })
                      }
                    >
                      Import
                    </Button>
                  </div>
                </div>
              </div>
            )
          )
        )}
      </ul>
      {openModal ? (
        <DeleteModal setOpenModal={setOpenModal} data={tokenId} />
      ) : null}
      {showBurnModal && (
        <BurnModal
          balance={tokenBalance}
          addr={tokenAddr}
          doBurnCallback={(v, addr) => performBurnOperation(v, addr)}
          closeModalCallback={(_) => setShowBurnModal(!1)}
        />
      )}
    </div>
  );
};
