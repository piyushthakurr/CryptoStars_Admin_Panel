import React from "react";
import { withRouter } from "react-router";
import { useDispatch } from "react-redux";
import "./../Header/Header.scss";
import "./Connect-Wallet-Modal.scss";
import { Link } from "react-router-dom";
import { login } from "../../redux/actions";
import { ContractServices } from "../../services/ContractServices";
import Card from "../Card/Card";
import closeBtn from "../../assets/images/ionic-md-close.svg";
import { toast } from "../Toast/Toast";
import WalletConnectProvider from "@walletconnect/web3-provider";
import RouterABI from "../../assets/ABI/router.ABI.json";
import { MAIN_CONTRACT_LIST } from "../../assets/tokens/index";
import { clearEnv, LocalStore, rEqual } from "../../services/utils";
import { EVENTS, STR_CONSTANT, WALLET_TYPE } from "../../constant";
import { WalletService } from "../../services/WalletServices";
import { LS_KEYS } from "../../services/constants";

const ConnectWalletModal = ({ setShowModal }) => {
  const dispatch = useDispatch();

  const connect2wallet = async (walletType) => {
    try {
      if (rEqual(walletType, WALLET_TYPE.METAMASK)) {
        console.log("calling contract", walletType);
        const account = await ContractServices.isMetamaskInstalled(walletType);
        if (account === null) {
          return;
        }
        LocalStore.add(LS_KEYS.WALLET_TYPE, walletType);
        localStorage.setItem("staticNwId", 338);
        ContractServices.setWalletType(walletType);
        WalletService.setupWalletEventListeners(walletType);

        if (await ContractServices.isAdminAccount(account)) {
          console.log("is admin TRUE");
          dispatch(login({ account, walletType }));
          setShowModal(!1);
        } else {
          toast.error(STR_CONSTANT.NOT_AN_ADMIN);
          clearEnv();
        }
      } else if (rEqual(walletType, WALLET_TYPE.NONE)) {
      } else {
        toast.error(STR_CONSTANT.WALLET_INVALID);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="modal--connect-wallet">
      <div className="backdrop"></div>
      <Card className="profile_modal">
        <div className="col modal_headerStyle">
          <div className="row modal_headerStyle__rowA lessMargin_bottom">
            <div className=" modal_headerStyle__rowA_colLeft">
              <h2>Connect to a wallet</h2>
            </div>
            <div className="col modal_headerStyle__rowA_colRight">
              <Link to="#" onClick={() => setShowModal(!1)}>
                <img src={closeBtn} alt="icon" />
              </Link>
            </div>
          </div>
        </div>
        <div className="row modal_headerStyle__rowB">
          <div className="wallet_list">
            <button
              style={{ cursor: "pointer" }}
              type="button"
              onClick={() => connect2wallet(WALLET_TYPE.METAMASK)}
            >
              <div color="primary" className="sc-gsTCUz fThFHj">
                Metamask
              </div>
              <svg
                viewBox="0 0 96 96"
                width="32px"
                color="text"
                xmlns="http://www.w3.org/2000/svg"
                className="sc-bdfBwQ dhaIlc"
              >
                <circle cx="48" cy="48" r="48" fill="white"></circle>
                <path
                  d="M77.7602 16.9155L51.9419 36.0497L56.7382 24.7733L77.7602 16.9155Z"
                  fill="#E17726"
                ></path>
                <path
                  d="M18.2656 16.9155L43.8288 36.2283L39.2622 24.7733L18.2656 16.9155Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M68.4736 61.2808L61.6108 71.7918L76.3059 75.8482L80.4899 61.5104L68.4736 61.2808Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M15.5356 61.5104L19.6941 75.8482L34.3892 71.7918L27.5519 61.2808L15.5356 61.5104Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M33.5984 43.5251L29.491 49.699L44.0584 50.3624L43.5482 34.6724L33.5984 43.5251Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M62.4274 43.525L52.2991 34.4937L51.9419 50.3622L66.5094 49.6989L62.4274 43.525Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M34.3892 71.7922L43.1654 67.5316L35.6137 61.6128L34.3892 71.7922Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M52.8345 67.5316L61.6107 71.7922L60.3861 61.6128L52.8345 67.5316Z"
                  fill="#E27625"
                ></path>
                <path
                  d="M61.6107 71.7923L52.8345 67.5317L53.5233 73.2465L53.4468 75.6446L61.6107 71.7923Z"
                  fill="#D5BFB2"
                ></path>
                <path
                  d="M34.3892 71.7923L42.5531 75.6446L42.502 73.2465L43.1654 67.5317L34.3892 71.7923Z"
                  fill="#D5BFB2"
                ></path>
                <path
                  d="M42.7062 57.8369L35.4097 55.6939L40.5631 53.3213L42.7062 57.8369Z"
                  fill="#233447"
                ></path>
                <path
                  d="M53.2937 57.8369L55.4367 53.3213L60.6412 55.6939L53.2937 57.8369Z"
                  fill="#233447"
                ></path>
                <path
                  d="M34.3893 71.7918L35.6649 61.2808L27.552 61.5104L34.3893 71.7918Z"
                  fill="#CC6228"
                ></path>
                <path
                  d="M60.3352 61.2808L61.6108 71.7918L68.4736 61.5104L60.3352 61.2808Z"
                  fill="#CC6228"
                ></path>
                <path
                  d="M66.5094 49.6987L51.9419 50.362L53.294 57.8371L55.4371 53.3215L60.6416 55.6941L66.5094 49.6987Z"
                  fill="#CC6228"
                ></path>
                <path
                  d="M35.4098 55.6941L40.5633 53.3215L42.7063 57.8371L44.0584 50.362L29.491 49.6987L35.4098 55.6941Z"
                  fill="#CC6228"
                ></path>
                <path
                  d="M29.491 49.6987L35.6139 61.6129L35.4098 55.6941L29.491 49.6987Z"
                  fill="#E27525"
                ></path>
                <path
                  d="M60.6414 55.6941L60.3862 61.6129L66.5092 49.6987L60.6414 55.6941Z"
                  fill="#E27525"
                ></path>
                <path
                  d="M44.0584 50.3618L42.7063 57.8369L44.4156 66.6641L44.7728 55.0305L44.0584 50.3618Z"
                  fill="#E27525"
                ></path>
                <path
                  d="M51.9415 50.3618L51.2527 55.005L51.5843 66.6641L53.2937 57.8369L51.9415 50.3618Z"
                  fill="#E27525"
                ></path>
                <path
                  d="M53.2938 57.8374L51.5845 66.6646L52.8346 67.532L60.3862 61.6132L60.6413 55.6943L53.2938 57.8374Z"
                  fill="#F5841F"
                ></path>
                <path
                  d="M35.4097 55.6943L35.6138 61.6132L43.1654 67.532L44.4155 66.6646L42.7062 57.8374L35.4097 55.6943Z"
                  fill="#F5841F"
                ></path>
                <path
                  d="M53.4468 75.6443L53.5233 73.2462L52.8855 72.6849H43.1143L42.502 73.2462L42.5531 75.6443L34.3892 71.792L37.2465 74.1391L43.0378 78.1445H52.962L58.7533 74.1391L61.6107 71.792L53.4468 75.6443Z"
                  fill="#C0AC9D"
                ></path>
                <path
                  d="M52.8346 67.5315L51.5845 66.6641H44.4156L43.1655 67.5315L42.5022 73.2462L43.1145 72.6849H52.8857L53.5235 73.2462L52.8346 67.5315Z"
                  fill="#161616"
                ></path>
                <path
                  d="M78.8314 37.2998L80.9999 26.7377L77.7599 16.9155L52.8345 35.4119L62.4271 43.5247L75.9485 47.4791L78.9335 43.984L77.6323 43.04L79.7243 41.1521L78.1426 39.902L80.2091 38.3458L78.8314 37.2998Z"
                  fill="#763E1A"
                ></path>
                <path
                  d="M15 26.7377L17.194 37.2998L15.7909 38.3458L17.8574 39.902L16.2756 41.1521L18.3676 43.04L17.0665 43.984L20.0514 47.4791L33.5984 43.5247L43.1655 35.4119L18.2656 16.9155L15 26.7377Z"
                  fill="#763E1A"
                ></path>
                <path
                  d="M75.9487 47.4793L62.4272 43.5249L66.5092 49.6989L60.3862 61.613L68.4736 61.511H80.4898L75.9487 47.4793Z"
                  fill="#F5841F"
                ></path>
                <path
                  d="M33.5983 43.5249L20.0513 47.4793L15.5356 61.511H27.5519L35.6137 61.613L29.4908 49.6989L33.5983 43.5249Z"
                  fill="#F5841F"
                ></path>
                <path
                  d="M51.9415 50.3617L52.8344 35.4115L56.7378 24.7729H39.262L43.1653 35.4115L44.0583 50.3617L44.3899 55.0559L44.4154 66.664H51.5843L51.6099 55.0559L51.9415 50.3617Z"
                  fill="#F5841F"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default withRouter(ConnectWalletModal);
