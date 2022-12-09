import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./PreviewToken.scss";
// import Button from "react-bootstrap/Button";
// import Modal from "react-bootstrap/Modal";
import back from "../../assets/images/back-arrow.svg";
import Web3 from "web3";
import { Modal, FormLabel, Button } from "react-bootstrap";
import { ContractServices } from "../../services/ContractServices";
import { MAIN_CONTRACT_LIST } from "../../assets/tokens/index";
import { TokenList } from "../../Pages/Tokenlist/TokenList";
import { Provider, useDispatch } from "react-redux";
import { savetoken, startLoading, stopLoading } from "../../redux/actions";
import { BSC_SCAN, STR_CONSTANT, URL } from "../../constant";
import checkicon from "../../assets/images/check_icon.svg";
import { saveTokenIconToDB, saveTokenInfoToDB } from "../../services/api";
import { useSelector } from "react-redux";
import { toast } from "../Toast/Toast";
import { notEmpty } from "../../services/utils";

// import xtype from "xtypejs";
function PreviewAddTokenModal({
  handleClose,
  handleShow,
  show,
  tokenIcon,
  setShow,
  tokenName,
  tokenSymbol,
  totalSupply,
  mintAddress,
  ownerAddress,
}) {
  const [data, setData] = useState();
  const [finalhash, setFinalhash] = useState("");
  const dispatch = useDispatch();
  const [result, setResult] = useState("");
  const [contractAddress, setContractAddress] = useState("");
  const priAccount = useSelector((s) => s.persist.priAccount);
  const currentNwId = localStorage.getItem("staticNwId");

  const letsCallTheContract = async () => {
    try {
      if (!priAccount) return toast.error(STR_CONSTANT.CONNECT_WALLET);
      dispatch(startLoading());
      const currentNwId = localStorage.getItem("staticNwId");

      let tokenFactory;
      if (currentNwId == 338) {
        tokenFactory = await ContractServices.callContract(
          MAIN_CONTRACT_LIST.tokenFactory.address,
          MAIN_CONTRACT_LIST.tokenFactory.abi
        );
      }
      if (currentNwId == 97) {
        tokenFactory = await ContractServices.callContract(
          MAIN_CONTRACT_LIST.tokenFactory.address1,
          MAIN_CONTRACT_LIST.tokenFactory.abi
        );
      }
      if (currentNwId == 43113) {
        tokenFactory = await ContractServices.callContract(
          MAIN_CONTRACT_LIST.tokenFactory.address2,
          MAIN_CONTRACT_LIST.tokenFactory.abi
        );
      }

      const w3 = ContractServices.callWeb3();
      let callCreate = await tokenFactory.methods
        .create(
          tokenName,
          tokenSymbol,
          mintAddress,
          w3.utils.toWei(totalSupply, "ether"),
          ownerAddress
        )
        .send({ from: priAccount });
      const contract_address = await callCreate.events[0].address;
      setContractAddress(contract_address);
      let cc = callCreate?.transactionHash;
      setFinalhash(cc);
      if (notEmpty(cc)) {
        const iconName = `${tokenSymbol}_${Date.now()}.${
          tokenIcon.type.split("/")[1]
        }`;
        const key = Math.floor(Math.random() * 100000);
        const nwChangeId = localStorage.getItem("staticNwId");
        const token_obj = {
          icon: tokenIcon.name.split(" ").join("_"),
          name: tokenName,
          sym: tokenSymbol,
          addr: contract_address,
          dec: 18,
          supply: totalSupply,
          nwChangeId: nwChangeId,
          keyId: key,
        };
        saveTokenIconToDB(tokenIcon, iconName, (_) => {
          saveTokenInfoToDB(token_obj, (d) => console.log("All data saved"));
        });
      }
      setResult(cc);
    } catch (error) {
      dispatch(stopLoading());
      return;
    }
    dispatch(stopLoading());
  };

  return (
    <div>
      <Modal
        show={show}
        onHide={handleClose}
        className="modal_preview text-white"
      >
        <Link to="#">
          <img src={back} alt="back_img" onClick={() => setShow(false)} />
        </Link>
        <Modal.Header className="token_head_sec">
          <h2>Confirm Token Details.</h2>
          {/* <p>Please enter token name, symbol and token supply</p> */}
        </Modal.Header>
        <Modal.Body className="preview_content text-white">
          <div className="token_info mb-3">
            <FormLabel className="text_head">Token Name:</FormLabel>
            <p>{tokenName.slice(0, 20) + "......"}</p>
          </div>
          <div className="token_info mb-3">
            <FormLabel className="text_head">Token Symbol:</FormLabel>
            <p>{tokenSymbol.slice(0, 20) + "......"}</p>
          </div>
          <div className="token_info mb-3">
            <FormLabel className="text_head">Total Supply:</FormLabel>
            <p>{totalSupply.slice(0, 20) + "......"}</p>
          </div>
          <div className="token_info mb-3">
            <FormLabel className="text_head">Mint Address:</FormLabel>
            <p>
              {mintAddress.slice(0, 8) +
                " ....... " +
                mintAddress.slice(35, 42)}
            </p>
          </div>
          <div className="token_info mb-3">
            <FormLabel className="text_head">Owner Address:</FormLabel>
            <p>
              {ownerAddress.slice(0, 8) +
                " ....... " +
                ownerAddress.slice(35, 42)}
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer className="token_footer">
          <Button
            variant="secondary"
            onClick={letsCallTheContract}
            style={{ marginTop: "-1200px" }}
          >
            Submit
          </Button>
        </Modal.Footer>
        {result ? (
          <div className="whole">
            <Modal.Dialog className="confirmation_modal" centered>
              {/* <Modal.Header closeButton></Modal.Header> */}
              <Modal.Body>
                <img src={checkicon} alt="icon" />
                {/* <a
                  href={`${URL.CRONOS_EXPLORER}/tx/${finalhash}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>View on Cronos Scan</p>
                </a> */}
                <a
                  href={
                    currentNwId == 338
                      ? `${URL.CRONOS_EXPLORER}/tx/${finalhash}`
                      : currentNwId == 97
                      ? `${URL.BNB_EXPLORER}/tx/${finalhash}`
                      : currentNwId == 43113
                      ? `${URL.AVA_EXPLORER}/tx/${finalhash}`
                      : null
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  <p>
                    View On{" "}
                    {currentNwId == 338
                      ? "Cronos Scan"
                      : currentNwId == 97
                      ? "Binance Scan"
                      : currentNwId == 43113
                      ? "Avalanche Scan"
                      : null}
                  </p>
                </a>
                <br />
                <Link to={"/tokenList"}>View Token</Link>
              </Modal.Body>
            </Modal.Dialog>
          </div>
        ) : (
          ""
        )}
      </Modal>
    </div>
  );
}

export default PreviewAddTokenModal;
