import React, { useEffect, useRef, useState } from "react";
import { withRouter } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import "./Header.scss";
import { Link } from "react-router-dom";
import { ReactComponent as MenuIcon } from "../../assets/images/menu_toggle_icon.svg";
import { ReactComponent as Iconfeathermenu } from "../../assets/images/Icon-feather-menu.svg";
import {
  login,
  logout,
  versionManager,
  updateTokenListTempo,
  tokenListAddTokens,
} from "../../redux/actions";
import { ContractServices } from "../../services/ContractServices";
import ProfileModal from "../ProfileModal/ProfileModal";
import Logo from "../../assets/images/logo_crypto.png";
import { toast } from "../Toast/Toast";
import WalletList from "./WalletList";
import { EVENTS, HOME_ROUTE, WALLET_TYPE } from "../../constant";
import WalletConnectProvider from "@walletconnect/web3-provider";
import {
  clearEnv,
  doPageReload,
  isNull,
  LocalStore,
  notEqual,
  rEqual,
  toStr,
} from "../../services/utils";
import { LS_KEYS } from "../../services/constants";
import { WalletService } from "../../services/WalletServices";
import { retrieveProjectVersion } from "../../services/api";

const Header = (props) => {
  const dispatch = useDispatch();
  const [isOpen, setModal] = useState(!1);
  const [walletShow, setWalletShow] = useState(!1);
  const localChainId = localStorage.getItem("staticNwId");
  const [network, setNetwork] = useState(localChainId || 338);

  // const getNetworkId = useSelector((state) => state.persist.networkid);
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);

  const ensureProjectIsUptoDate = (_) => {
    retrieveProjectVersion().then((version) => {
      const prevVer = LocalStore.get(LS_KEYS.PROJECT_VERSION);
      if (isNull(prevVer) || notEqual(toStr(prevVer), toStr(version))) {
        LocalStore.clear();
        LocalStore.add(LS_KEYS.PROJECT_VERSION, version);
        toast.warn("page reloads in 2 sec to get updated..");
        doPageReload(2);
      }
    });
  };

  useEffect((_) => {
    // ensureProjectIsUptoDate();
  }, []);

  // useEffect(() => {
  //   window.location.reload();
  // }, [localChainId]);

  const lock = useRef(!0);

  useEffect(() => {
    if (lock.current) {
      dispatch(versionManager());
      const wType = LocalStore.get(LS_KEYS.WALLET_TYPE);
      if (wType && notEqual(wType, WALLET_TYPE.NONE)) {
        LocalStore.add(LS_KEYS.WALLET_TYPE, wType);
        WalletService.setupWalletEventListeners(wType);
        dispatch(login({ account: isUserConnected, walletType: wType }));
      } else {
        console.log("wType:", wType, notEqual(wType, WALLET_TYPE.NONE));
        // dispatch(logout())
      }
      lock.current = !1;
    }
  }, []);

  const logoutCall = () => {
    dispatch(logout());
    setModal(!1);
    clearEnv();
  };

  const connectCall = () => {
    isUserConnected ? setModal(!isOpen) : setWalletShow(!0);
  };

  console.log("network", network);

  useEffect(() => {
    WalletService.requestChainChange();
    // window.location.reload();
  }, [network]);

  const networkID = (e) => {
    setNetwork(e.target.value);
    localStorage.setItem("staticNwId", e.target.value);
    if (window.ethereum) {
      window.ethereum.on("chainChanged", async () => {
        window.location.reload();
        await dispatch(updateTokenListTempo([]));
        await dispatch(tokenListAddTokens([]));
      });
    }
    // clearEnv();
  };

  return (
    <div className={`header_style ${props.className}`}>
      <div className="header_left_style">
        <div className="for_desktop">
          <Link to="#" onClick={props.small_nav}>
            {props.mobileIcon ? (
              <Iconfeathermenu className="desk" />
            ) : (
              <MenuIcon className="mobile" />
            )}
          </Link>
        </div>

        <div className="for_mobile">
          <Link to="#" onClick={props.small_nav}>
            {props.mobileIcon ? (
              <MenuIcon className="mobile" />
            ) : (
              <Iconfeathermenu className="desk" />
            )}
          </Link>
        </div>

        <Link to={`${HOME_ROUTE}`} className="header_logo">
          <img src={Logo} alt="icon" />
        </Link>
      </div>
      <div className="header_right_style">
        <div className="selectNetwork">
          <select onChange={(e) => networkID(e)} defaultValue={network}>
            {/* <option value="0">Please Select Network</option> */}
            <option value="338">Cronos</option>
            <option value="97">Binance</option>
            <option value="43113">Avalanche</option>
          </select>
        </div>

        <Link
          to="#"
          className="btn connect__Link"
          onClick={() => connectCall()}
        >
          {isUserConnected
            ? `${isUserConnected.substring(1, 6)}...${isUserConnected.substr(
                isUserConnected.length - 4
              )}`
            : "Connect"}
        </Link>
      </div>
      {isOpen && (
        <ProfileModal
          closeModal={() => setModal(!isOpen)}
          address={isUserConnected}
          logout={logoutCall}
        />
      )}
      {walletShow && <WalletList isWalletShow={setWalletShow} />}
    </div>
  );
};

export default withRouter(Header);
