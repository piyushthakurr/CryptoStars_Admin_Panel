import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./AddTokenModal.scss";
import "../../App.scss";
import "../../Pages/Public/Swap/Swap.scss";
import back from "../../assets/images/back-arrow.svg";
import { Modal, FormLabel, Button } from "react-bootstrap";
import PreviewAddTokenModal from "./PreviewAddTokenModal";
import Web3 from "web3";
import BigNumber from "bignumber.js";
import { VAL_CONSTANT } from "../../constant";

function AddTokenModal() {
  let refrenceVariable = false;
  const [show, setShow] = useState(false);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [mintAddress, setMintAddress] = useState("");
  const [ownerAddress, setOwnerAddress] = useState("");
  // const [errorCount, setErrorCount] = useState("0");
  const [tokenIcon, setTokenIcon] = useState(null);
  const [nameError, setnameError] = useState("");
  const [symbolError, setSymbolError] = useState("");
  const [supplyError, setSupplyError] = useState("");
  const [mintAddressError, setMintAddressError] = useState("");
  const [ownerAddressError, setOwnerAddressError] = useState("");
  const [error, setError] = useState(false);
  const [symbolsArr] = useState(["e", "E", "+", "-"]);

  const handleImagedata = (e) => {
    const file = e.target.files[0];
    console.log("File", file);
    setTokenIcon(file);
  };
  const handleChange = (e, fieldName) => {
    switch ((e, fieldName)) {
      case "tokenName":
        const { value } = e.target;
        console.log("Input value: ", value);
        const re = /^[a-z 0-9]+( [a-z 0-9]+)*$/gi;

        if (value === "" || re.test(value)) {
          setTokenName(value);
        }
        value == ""
          ? setnameError("Please Enter Token Name")
          : setnameError("");
        setError(false);
        // setTokenName(e.target.value);
        break;
      case "tokenSymbol":
        const value1 = e.target.value;
        const re1 = /^[A-Za-z]+$/;
        if (value1 === "" || re1.test(value1)) {
          setTokenSymbol(value1);
        }
        value1 == ""
          ? setSymbolError("Please Enter Token Name")
          : setSymbolError("");
        setError(false);
        break;
      case "totalSupply":
        const v = e.target.value;
        v === ""
          ? setSupplyError("Please Enter Token Supply")
          : v.indexOf(".") > -1
          ? setSupplyError("decimal not allowed")
          : BigNumber(v).lte(BigNumber(0))
          ? setSupplyError("must be non zero value")
          : BigNumber(v).gt(BigNumber(VAL_CONSTANT.MAX_256_DEC_10_18))
          ? setSupplyError("Number too big")
          : setSupplyError("");
        setError(
          v === "" ||
            v.indexOf(".") > -1 ||
            BigNumber(v).lte(BigNumber(0)) ||
            BigNumber(v).gt(BigNumber(VAL_CONSTANT.MAX_256_DEC_10_18))
        );
        setTotalSupply(e.target.value.toString());
        break;
      case "mintAddress":
        e.target.value == ""
          ? setMintAddressError("Please Enter Mint Address")
          : setMintAddressError("");
        setError(false);
        try {
          const isValidAddress = Web3.utils.toChecksumAddress(e.target.value);
          if (isValidAddress || e.target.value) {
            setMintAddress(e.target.value);
            setMintAddressError("");
            setError(false);
          }
        } catch (err) {
          setError(true);
          setMintAddress(e.target.value);
          setMintAddressError("Please  Enter correct Mint Address");
        }
        refrenceVariable = true;
        break;
      case "ownerAddress":
        e.target.value == ""
          ? setOwnerAddressError("Please Enter Mint Address")
          : setOwnerAddressError("");
        setError(false);
        try {
          const isValidAddress = Web3.utils.toChecksumAddress(e.target.value);
          if (isValidAddress || e.target.value) {
            setOwnerAddress(e.target.value);
            setOwnerAddressError("");
            setError(false);
          }
        } catch (err) {
          setError(true);
          setOwnerAddress(e.target.value);
          setOwnerAddressError("Please  Enter correct Mint Address");
        }
        // e.target.value==''?setOwnerAddressError("Please Enter Owner Address"):setOwnerAddressError('')
        // setOwnerAddress(e.target.value);
        refrenceVariable = true;
        break;
      default:
        console.log("default case");
    }
  };
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const Preview = () => {
    if (tokenName == "") {
      setnameError("Please Enter Token Name");
      setError(true);
    }
    if (tokenSymbol == "") {
      setSymbolError("Please Enter Token Symbol");
      setError(true);
    }
    if (totalSupply == "") {
      setSupplyError("Please Enter Token TotalSupply");
      setError(true);
    }
    if (mintAddress == "") {
      setMintAddressError("Please Enter Mint Address");
      setError(true);
    }
    if (ownerAddress == "") {
      setOwnerAddressError("Please Enter Owner Address");
      setError(true);
    }
    if (
      error == false &&
      (tokenName !== "") &
        (tokenSymbol != "") &
        (totalSupply != "") &
        (mintAddress != "") &
        (ownerAddress != "")
    ) {
      setShow(true);
    }
  };

  return (
    <>
      <div
        className="container container_swapwrap"
        style={{ marginLeft: "00px" }}
      >
        <div className="row">
          <div className="container container_inside token">
            <div className="token_modal">
              <div className="token_head_sec">
                <h2>Add Token</h2>
                <p>Please enter token name, symbol and token supply</p>
              </div>
              <ul>
                <li>
                  <div className="token_info d-flex mb-3">
                    <FormLabel className="text_head">Token Icon</FormLabel>
                    <div className="input_text">
                      <input
                        label="Token Icon"
                        type="file"
                        accept=".png,.jpg"
                        onChange={handleImagedata}
                        className="choose_file"
                      />
                      {/* <span>{nameError}</span> */}
                    </div>
                  </div>
                </li>
                <li>
                  <div className="token_info d-flex mb-3">
                    <FormLabel className="text_head">Token Name</FormLabel>
                    <div className="input_text">
                      <input
                        label="Token Name"
                        type="text"
                        value={tokenName}
                        onKeyPress={(event) =>
                          (event.code >= 65 && event.code <= 90) ||
                          (event.code >= 97 && event.code <= 122)
                        }
                        onChange={(e) => handleChange(e, "tokenName")}
                      />
                      <span>{nameError}</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="token_info d-flex mb-3">
                    <FormLabel className="text_head">Token Symbol</FormLabel>
                    <div className="input_text">
                      <input
                        label="Token Name"
                        type="text"
                        value={tokenSymbol}
                        onChange={(e) => handleChange(e, "tokenSymbol")}
                      />
                      <span>{symbolError}</span>
                    </div>
                  </div>
                </li>

                <li>
                  <div className="token_info d-flex mb-3">
                    <FormLabel className="text_head">Token Supply</FormLabel>
                    <div className="input_text">
                      <input
                        label="Token Name"
                        type="Number"
                        value={totalSupply}
                        onKeyDown={(evt) => {
                          symbolsArr.includes(evt.key) && evt.preventDefault();
                        }}
                        onChange={(e) => handleChange(e, "totalSupply")}
                      />
                      <span>{supplyError}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="token_info d-flex mb-3">
                    <FormLabel className="text_head">Mint Address</FormLabel>
                    <div className="input_text">
                      <input
                        label="Token Name"
                        type="text"
                        value={mintAddress}
                        onChange={(e) => handleChange(e, "mintAddress")}
                      />
                      <span>{mintAddressError}</span>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="token_info d-flex mb-3">
                    <FormLabel className="text_head">Owner Address</FormLabel>
                    <div className="input_text">
                      <input
                        label="Token Name"
                        type="text"
                        value={ownerAddress}
                        onChange={(e) => handleChange(e, "ownerAddress")}
                        required="true"
                      />
                      <span>{ownerAddressError}</span>
                    </div>
                  </div>
                </li>
              </ul>

              <div className="token_footer">
                <Button variant="secondary" onClick={Preview}>
                  Preview
                </Button>
              </div>
              <PreviewAddTokenModal
                handleShow={handleShow}
                handleClose={handleClose}
                show={show}
                setShow={setShow}
                tokenIcon={tokenIcon}
                tokenName={tokenName}
                tokenSymbol={tokenSymbol}
                totalSupply={totalSupply}
                mintAddress={mintAddress}
                ownerAddress={ownerAddress}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddTokenModal;
