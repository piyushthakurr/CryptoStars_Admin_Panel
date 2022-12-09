import "./Tokenlist.scss";
import { Link } from "react-router-dom";
import closeBtn from "../../assets/images/ionic-md-close.svg";
import { eHandle, notEmpty, rEqual } from "../../services/utils";
import { useState } from "react";
import Card from "../../Components/Card/Card";
import Button from "../../Components/Button/Button";

const BurnModal = ({ closeModalCallback, doBurnCallback, balance, addr }) => {
  const [valueErr, setValueErr] = useState("");
  const [burnValue, setBurnValue] = useState("");
  return (
    <div className="burn-modal--container">
      <div className="backdrop"></div>
      <div className="burn-token_modal">
        <div className=" modal_headerStyle__rowA_colRight">
          <Link to="#" onClick={(e) => eHandle(e) && closeModalCallback()}>
            <img src={closeBtn} alt="icon" />
          </Link>
        </div>
        <div className="burn-modal--body">
          <div>
            Balance:
            <span>{balance}</span>
          </div>
          <div>
            Amount:
            <input
              type="number"
              className="inputStyle"
              onChange={(e) => {
                eHandle(e);
                const val = e.target.value;
                if (Number(val) > Number(balance))
                  setValueErr("exceeds balance");
                else if (rEqual(parseFloat(val), 0))
                  setValueErr("cant be zero");
                else {
                  setValueErr("");
                  setBurnValue(val);
                }
              }}
              value={burnValue}
            />
            {notEmpty(valueErr) ? (
              <span className="burn-input-error">{valueErr}</span>
            ) : (
              <></>
            )}
          </div>
          <div>
            <Button
              onClick={(e) =>
                eHandle(e) &&
                !notEmpty(valueErr) &&
                doBurnCallback(burnValue, addr)
              }
            >
              DO BURN
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnModal;
