import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConnectWalletModal from "../../../Components/Connect/ConnectWalletModal";
import { eHandle } from "../../../services/utils";

const CryptoStarHome = () => {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const persist = useSelector((s) => s.persist);
  useEffect(
    (_) => {
      console.log("isConnected", persist.priAccount, persist.isConnected);
    },
    [persist.isConnected]
  );
  return (
    <div className="container_swapwrap">
      <div className="connect--main">
        {showWalletModal && (
          <ConnectWalletModal setShowModal={setShowWalletModal} />
        )}
        {!persist.isConnected && (
          <div className="connect_box">
            <h2>Connect Wallet</h2>
            <button
              className="btn--connect-main btn-pill"
              onClick={(e) =>
                eHandle(e) && (persist.isConnected || setShowWalletModal(!0))
              }
            >
              Connect
            </button>
          </div>
        )}
        {persist.isConnected && <h1 className="m-0">Welcome to Crypto Star</h1>}
      </div>
    </div>
  );
};

export default CryptoStarHome;
