import {
  stopLoading,
  startLoading,
  addTransaction,
  checkUserLpTokens,
  updateTokenListTempo,
} from "../../../redux/actions";
import { BigNumber } from "bignumber.js";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";
import { toHex } from "../../../services/utils";
import Card from "../../../Components/Card/Card";
import useCommonHook from "../../../hooks/common";
import React, { useState, useEffect } from "react";
import Button from "../../../Components/Button/Button";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../../Components/Toast/Toast";
import { savePoolInfoToDB } from "../../../services/api";
import closeBtn from "../../../assets/images/ionic-md-close.svg";
import awesomePlus from "../../../assets/images/awesome-plus.svg";
import { isAddr, notEqual, rEqual } from "../../../services/utils";
import { ExchangeService } from "../../../services/ExchangeService";
import { ContractServices } from "../../../services/ContractServices";
import defaultImg from "../../../assets/images/token_icons/default.svg";
import awesomeArrowLeft from "../../../assets/images/awesome-arrow-left.svg";
import TransactionModal from "../../../Components/TransactionModal/TransactionModal";
import ModalSelectToken from "../../../Components/ModalSelectToken/ModalSelectToken";
import {
  INIT_VAL,
  MAIN_CONTRACT_LIST,
  TOKEN_LIST,
  WETH,
} from "../../../assets/tokens";
import { STR_CONSTANT, TOKEN, VAL_CONSTANT } from "../../../constant";
import InputSelectCurrency from "../../../Components/InputSelectCurrency/InputSelectCurrency";
import { useRef } from "react";

const AddLiquidity = (props) => {
  const dispatch = useDispatch();
  const commonHook = useCommonHook();
  const MINIMUM_LIQUIDITY = 10 ** 3;

  const persist = useSelector((s) => s.persist);
  const deadline = useSelector((state) => state.persist.deadline);
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const slippagePercentage = useSelector(
    (state) => state.persist.slippagePercentage
  );

  const [txHash, setTxHash] = useState("");
  const [search, setSearch] = useState("");
  const [tokenOne, setTokenOne] = useState({});
  const [tokenTwo, setTokenTwo] = useState({});
  const [tokenType, setTokenType] = useState(TOKEN.A);
  const [tokenOneValue, setTokenOneValue] = useState();
  const [tokenTwoValue, setTokenTwoValue] = useState();
  const [lpTokenBalance, setLpTokenBalance] = useState(0);
  const [sharePoolValue, setSharePoolValue] = useState(100);
  const [tokenOneBalance, setTokenOneBalance] = useState(0);
  const [tokenTwoBalance, setTokenTwoBalance] = useState(0);
  const [modalCurrency, setModalCurrency] = useState(!1);
  const [tokenOneDeposit, setTokenOneDeposit] = useState(0);
  const [tokenTwoDeposit, setTokenTwoDeposit] = useState(0);
  const [firstProvider, setFirstProvider] = useState(!1);
  const [showPoolShare, setShowPoolShare] = useState(!1);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [showSupplyModal, setShowSupplyModal] = useState(!1);
  const [tokenOneApproved, setTokenOneApproved] = useState(!1);
  const [tokenTwoApproved, setTokenTwoApproved] = useState(!1);
  const [tokenOneApproval, setTokenOneApproval] = useState(!1);
  const [tokenTwoApproval, setTokenTwoApproval] = useState(!1);
  const [currentPairAddress, setCurrentPairAddress] = useState("");
  const [showTransactionModal, setShowTransactionModal] = useState(!1);
  const [approvalConfirmation, setApprovalConfirmation] = useState(!1);
  const [liquidityConfirmation, setLiquidityConfirmation] = useState(!1);
  const [tokenOneCurrency, setCurrencyNameForTokenOne] = useState(
    STR_CONSTANT.DEF_CURRENCY_SYM
  );
  const [tokenTwoCurrency, setCurrencyNameForTokenTwo] = useState(
    STR_CONSTANT.DEF_CURRENCY_SYM
  );
  const [storeDataRedux, setStoreDataRedux] = useState([]);
  const nwChangeId = localStorage.getItem("staticNwId");

  const lock = useRef(!0);
  useEffect((_) => {
    if (lock.current) {
      init();
      commonHook.init();
      lock.current = !1;
    }
  });
  console.log("props96", props);
  console.log("tokenOne", tokenOne);
  console.log("tokenTwo", tokenTwo);

  const init = async () => {
    console.log("initTTTTTTTTTT", props);
    if (isUserConnected) {
      const oneBalance = await ContractServices.getBNBBalance(isUserConnected);
      // setTokenOneBalance(oneBalance);
      const { lptoken } = props;
      if (lptoken) {
        setCurrentPairAddress(lptoken.pair);
        setLpTokenBalance(lptoken.balance);
        setSharePoolValue(lptoken.poolShare);
        if (lptoken.token0Obj) {
          setTokenOne(lptoken.token0Obj);
          setCurrencyNameForTokenOne(lptoken.token0Obj.symbol);
          setTokenOneDeposit(lptoken.token0Deposit);
          let tokenBal = 0;
          if (lptoken.token0Obj.address === "BNB") {
            tokenBal = oneBalance;
          } else {
            tokenBal = await ContractServices.getTokenBalance(
              lptoken.token0Obj.address,
              isUserConnected
            );
          }
          setTokenOneBalance(tokenBal);
        }
        if (lptoken.token1Obj) {
          setTokenTwo(lptoken.token1Obj);
          setCurrencyNameForTokenTwo(lptoken.token1Obj.symbol);
          setTokenTwoDeposit(lptoken.token1Deposit);
          let tokenBal = 0;
          if (lptoken.token1Obj.address === "BNB") {
            tokenBal = oneBalance;
          } else {
            tokenBal = await ContractServices.getTokenBalance(
              lptoken.token1Obj.address,
              isUserConnected
            );
          }
          setTokenTwoBalance(tokenBal);
        }
      }
    }
    return !0;
  };

  const closeTransactionModal = () => {
    setShowTransactionModal(!1);
    props.backBtn();
    window.location.reload();
  };

  const onHandleOpenModal = async (tokenType) => {
    await dispatch(updateTokenListTempo([]));
    dispatch(updateTokenListTempo(persist.tokenList));
    const { ethereum, web3 } = window;
    if (!isUserConnected) {
      return toast.error(STR_CONSTANT.CONNECT_WALLET);
    }
    setSelectedCurrency(
      rEqual(tokenType, TOKEN.A) ? tokenTwoCurrency : tokenOneCurrency
    );
    setModalCurrency({
      modalCurrency: !0,
    });
    setTokenType(tokenType);
  };

  const resetTokenCurrency = (tokenType) => {
    if (rEqual(tokenType, TOKEN.A)) {
      setTokenOne({});
      setTokenOneBalance(0);
      setCurrencyNameForTokenOne(STR_CONSTANT.DEF_CURRENCY_SYM);
    } else if (rEqual(tokenType, TOKEN.B)) {
      setTokenTwo({});
      setTokenTwoBalance(0);
      setCurrencyNameForTokenTwo(STR_CONSTANT.DEF_CURRENCY_SYM);
    }
  };

  const onHandleSelectCurrency = async (token, selected) => {
    const { address, symbol } = token;
    if (!isUserConnected) {
      return toast.error(STR_CONSTANT.CONNECT_WALLET);
    }
    let a1,
      a2,
      oneBalance = 0,
      twoBalance = 0;
    if (selected === TOKEN.A) {
      if (rEqual(tokenOne.address, address)) {
        toast.info(STR_CONSTANT.TOKEN_ALREADY);
        return;
      }
      if (rEqual(tokenTwo.address, address)) {
        resetTokenCurrency(TOKEN.B);
        return;
      }
      a1 = address;
      if (address === "BNB") {
        oneBalance = await ContractServices.getBNBBalance(isUserConnected);
        setTokenOneApproved(!0);
      } else {
        setTokenOneApproved(!1);
        oneBalance = await ContractServices.getTokenBalance(
          address,
          isUserConnected
        );
      }
      setTokenOne(token);
      setCurrencyNameForTokenOne(symbol);
      setTokenOneBalance(oneBalance);
      if (tokenTwo.address) {
        a2 = tokenTwo.address;
      }
      if (tokenOneValue > 0) {
        const r = await getAllowance(tokenOneValue, TOKEN.A);
      }
    }
    if (rEqual(selected, TOKEN.B)) {
      if (rEqual(tokenTwo.address, address)) {
        toast.info(STR_CONSTANT.TOKEN_ALREADY);
        return;
      }
      if (rEqual(tokenOne.address, address)) {
        resetTokenCurrency(TOKEN.A);
        return;
      }

      a2 = address;
      if (address === "BNB") {
        setTokenTwoApproved(!0);
        twoBalance = await ContractServices.getBNBBalance(isUserConnected);
      } else {
        setTokenTwoApproved(!1);
        twoBalance = await ContractServices.getTokenBalance(
          address,
          isUserConnected
        );
      }
      setTokenTwo(token);
      setCurrencyNameForTokenTwo(symbol);
      setTokenTwoBalance(twoBalance);
      if (tokenOne.address) {
        a1 = tokenOne.address;
      }
      if (tokenTwoValue > 0) {
        const r = await getAllowance(tokenTwoValue, TOKEN.B);
      }
    }
    setModalCurrency(!modalCurrency);
    if (a1 && a2) {
      let currentPairAddress;
      if (a1 === "BNB") {
        a1 = WETH; //WETH
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      } else if (a2 === "BNB") {
        a2 = WETH; //WETH
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      } else {
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      }

      if (isAddr(currentPairAddress)) {
        console.log("currentPairAddress256", currentPairAddress);
        setCurrentPairAddress(currentPairAddress);
        const lpTokenBalance = await ContractServices.getTokenBalance(
          currentPairAddress,
          isUserConnected
        );
        setLpTokenBalance(lpTokenBalance);
        setFirstProvider(!1);
        setShowPoolShare(!0);
      } else {
        setCurrentPairAddress("");
        setFirstProvider(!0);
        setShowPoolShare(!0);
        setLpTokenBalance(0);
      }
    }
  };

  console.log(" persist.tokenListTempo", persist.tokenListTempo);

  useEffect(() => {
    let storeDataRedux = persist.tokenListTempo;
    storeDataRedux = storeDataRedux.filter((obj) => {
      return obj.nwChangeId == nwChangeId;
    });
    setStoreDataRedux(storeDataRedux);
    console.log("storeDataRedux", storeDataRedux);
  }, [persist.tokenListTempo]);

  console.log("storeDataRedux", storeDataRedux);

  const getAllowance = async (amount, tokenType) => {
    if (rEqual(tokenType, TOKEN.A)) {
      if (isUserConnected && tokenOne.address !== "BNB") {
        console.log("getAllowanceSSSS Token A");
        const nwChangeId = localStorage.getItem("staticNwId");
        console.log("Data getAllowanc chaindid", nwChangeId);
        let allowance;
        if (nwChangeId == 338) {
          allowance = await ContractServices.allowanceToken(
            tokenOne.address,
            MAIN_CONTRACT_LIST.router.address,
            isUserConnected
          );
        } else if (nwChangeId == 97) {
          allowance = await ContractServices.allowanceToken(
            tokenOne.address,
            MAIN_CONTRACT_LIST.router.address2,
            isUserConnected
          );
        } else if (nwChangeId == 43113) {
          allowance = await ContractServices.allowanceToken(
            tokenOne.address,
            MAIN_CONTRACT_LIST.router.address3,
            isUserConnected
          );
        }
        // let allowance = await ContractServices.allowanceToken(
        //   tokenOne.address,
        //   MAIN_CONTRACT_LIST.router.address,
        //   isUserConnected
        // );
        allowance = Number(allowance) / 10 ** Number(tokenOne.decimals);
        // console.log(allowance, 'token 1')
        if (amount > allowance) {
          setTokenOneApproval(!0);
        } else {
          setTokenOneApproved(!0);
        }
      } else {
        setTokenOneApproved(!0);
      }
    }
    if (rEqual(tokenType, TOKEN.B)) {
      if (isUserConnected && tokenTwo.address !== "BNB") {
        console.log("getAllowanceSSSS Token B");
        const nwChangeId = localStorage.getItem("staticNwId");
        console.log("Data getAllowanc chaindid", nwChangeId);
        let allowance;
        if (nwChangeId == 338) {
          allowance = await ContractServices.allowanceToken(
            tokenTwo.address,
            MAIN_CONTRACT_LIST.router.address,
            isUserConnected
          );
        } else if (nwChangeId == 97) {
          allowance = await ContractServices.allowanceToken(
            tokenTwo.address,
            MAIN_CONTRACT_LIST.router.address2,
            isUserConnected
          );
        } else if (nwChangeId == 43113) {
          allowance = await ContractServices.allowanceToken(
            tokenTwo.address,
            MAIN_CONTRACT_LIST.router.address3,
            isUserConnected
          );
        }
        // let allowance = await ContractServices.allowanceToken(
        //   tokenTwo.address,
        //   MAIN_CONTRACT_LIST.router.address,
        //   isUserConnected
        // );
        allowance = Number(allowance) / 10 ** Number(tokenTwo.decimals);
        // console.log(allowance, 'token 2')
        if (amount > allowance) {
          setTokenTwoApproval(!0);
        } else {
          setTokenTwoApproved(!0);
        }
      } else {
        setTokenTwoApproved(!0);
      }
    }
    return !0;
  };

  const handleTokenValue = async (amount, tokenType) => {
    console.log("amount, tokenType", amount, tokenType);
    console.log("tokenType, TOKEN.A", tokenType, TOKEN.A);
    if (rEqual(tokenType, TOKEN.A)) {
      setTokenOneValue(amount);

      const r = await getAllowance(amount, tokenType);
      console.log("rrrrrr", r);

      if (r && tokenOne.address && tokenTwo.address && amount >= 0) {
        let tokenAddress = tokenOne.address;
        console.log("tokenAddressIF", tokenAddress);
        if (tokenOne.address === "BNB") {
          tokenAddress = WETH;
        }
        console.log("currentPairAddress", currentPairAddress);
        if (currentPairAddress) {
          const tk0 = await ExchangeService.getTokenZero(currentPairAddress);
          const tk1 = await ExchangeService.getTokenOne(currentPairAddress);
          const reserves = await ExchangeService.getReserves(
            currentPairAddress
          );
          const token0Decimal = await ContractServices.getDecimals(tk0);
          const token1Decimal = await ContractServices.getDecimals(tk1);

          if (tk0 && reserves) {
            console.log("tokenAddress, tk0", tokenAddress, tk0);
            let a;
            if (rEqual(tokenAddress, tk0)) {
              a = (
                amount *
                (reserves[1] /
                  10 ** token1Decimal /
                  (reserves[0] / 10 ** token0Decimal))
              ).toFixed(5);
            } else {
              a = (
                amount *
                (reserves[0] /
                  10 ** token0Decimal /
                  (reserves[1] / 10 ** token1Decimal))
              ).toFixed(5);
            }
            console.log("a amount", a);
            if (a == 0) {
              setTokenTwoValue("");
            } else {
              setTokenTwoValue(a);
            }
            if (!tokenTwoApproval) {
              const r = await getAllowance(a, TOKEN.B);
              handleApprovalButton(TOKEN.B);
            }
          }
        }
      }
    }
    if (rEqual(tokenType, TOKEN.B)) {
      setTokenTwoValue(amount);
      const r = await getAllowance(amount, tokenType);
      if (r && tokenOne.address && tokenTwo.address && amount > 0) {
        let tokenAddress = tokenTwo.address;
        if (tokenTwo.address === "BNB") {
          tokenAddress = WETH;
        }
        if (currentPairAddress) {
          const tk0 = await ExchangeService.getTokenZero(currentPairAddress);
          const tk1 = await ExchangeService.getTokenOne(currentPairAddress);
          const reserves = await ExchangeService.getReserves(
            currentPairAddress
          );
          const token0Decimal = await ContractServices.getDecimals(tk0);
          const token1Decimal = await ContractServices.getDecimals(tk1);

          if (tk0 && reserves) {
            let a;
            if (rEqual(tokenAddress, tk0)) {
              a = (
                amount *
                (reserves[1] /
                  10 ** token1Decimal /
                  (reserves[0] / 10 ** token0Decimal))
              ).toFixed(5);
            } else {
              a = (
                amount *
                (reserves[0] /
                  10 ** token0Decimal /
                  (reserves[1] / 10 ** token1Decimal))
              ).toFixed(5);
            }
            setTokenOneValue(a);
            if (!tokenOneApproval) {
              const r = await getAllowance(a, TOKEN.A);
              handleApprovalButton(TOKEN.A);
            }
          }
        }
      }
    }
    if (tokenOne.address && tokenTwo.address) {
      let a1 = tokenOne.address,
        a2 = tokenTwo.address;

      let currentPairAddress;
      if (a1 === "BNB") {
        a1 = WETH; //WETH
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      } else if (a2 === "BNB") {
        a2 = WETH; //WETH
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      } else {
        currentPairAddress = await ExchangeService.getPair(a1, a2);
      }
      if (isAddr(currentPairAddress)) {
        console.log("currentPairAddress477", currentPairAddress);

        setCurrentPairAddress(currentPairAddress);
        const lpTokenBalance = await ContractServices.getTokenBalance(
          currentPairAddress,
          isUserConnected
        );
        setLpTokenBalance(lpTokenBalance);
        const reserves = await ExchangeService.getReserves(currentPairAddress);
        const ratio = await calculateLiquidityPercentage(reserves);
        setSharePoolValue(ratio);
        setFirstProvider(!1);
        setShowPoolShare(!0);
      } else {
        setCurrentPairAddress("");
        setFirstProvider(!0);
        setShowPoolShare(!0);
        setLpTokenBalance(0);
      }
    }
  };
  //call web3 approval function
  const handleTokenApproval = async (tokenType) => {
    if (!isUserConnected) {
      return toast.info(STR_CONSTANT.CONNECT_WALLET);
    }
    if (approvalConfirmation) {
      return toast.info("Token approval is processing");
    }
    // const value = (2*256 - 1).toString();
    const value = VAL_CONSTANT.MAX_256;
    let tokenAddress = "BNB";
    if (rEqual(tokenType, TOKEN.A)) {
      tokenAddress = tokenOne.address;
    }
    if (rEqual(tokenType, TOKEN.B)) {
      tokenAddress = tokenTwo.address;
    }
    try {
      dispatch(startLoading());
      console.log("handel approval");
      const nwChangeId = localStorage.getItem("staticNwId");
      console.log("DataAAAAAAAhandleTokenApproval", nwChangeId);
      let r;
      if (nwChangeId == 338) {
        r = await ContractServices.approveToken(
          isUserConnected,
          value,
          MAIN_CONTRACT_LIST.router.address,
          tokenAddress
        );
        console.log("if handleTokenApproval", nwChangeId);
      } else if (nwChangeId == 97) {
        r = await ContractServices.approveToken(
          isUserConnected,
          value,
          MAIN_CONTRACT_LIST.router.address2,
          tokenAddress
        );
        console.log("if else handleTokenApproval", nwChangeId);
      } else if (nwChangeId == 43113) {
        r = await ContractServices.approveToken(
          isUserConnected,
          value,
          MAIN_CONTRACT_LIST.router.address3,
          tokenAddress
        );
        console.log("if elsehandleTokenApproval 2", nwChangeId);
      }
      //  r = await ContractServices.approveToken(
      //   isUserConnected,
      //   value,
      //   MAIN_CONTRACT_LIST.router.address,
      //   tokenAddress
      // );
      if (r.code == 4001) {
        toast.error("User denied transaction signature.");
      } else {
        setApprovalConfirmation(!0);
        let data = {
          message: `Approve`,
          tx: r.transactionHash,
        };
        if (rEqual(tokenType, TOKEN.A)) {
          setTokenOneApproved(!0);
          setTokenOneApproval(!1);

          data.message = `Approve ${tokenOne.symbol}`;
        }
        if (rEqual(tokenType, TOKEN.B)) {
          setTokenTwoApproved(!0);
          setTokenTwoApproval(!1);
          data.message = `Approve ${tokenTwo.symbol}`;
        }
        dispatch(addTransaction(data));
        setApprovalConfirmation(!1);
      }
      dispatch(stopLoading());
    } catch (err) {
      setApprovalConfirmation(!1);
      dispatch(stopLoading());
      console.log(err);
      toast.error("Transaction Reverted!");
    }
  };

  const handleApprovalButton = (tokenType) => {
    if (tokenOneApproval && rEqual(tokenType, TOKEN.A)) {
      return (
        <div className="col button_unlockWallet">
          <Button
            className="full"
            onClick={() => handleTokenApproval(tokenType)}
            disabled={approvalConfirmation}
          >
            {`Approve ${tokenOne.symbol}`}
          </Button>
        </div>
      );
    }
    if (tokenTwoApproval && rEqual(tokenType, TOKEN.B)) {
      return (
        <div className="col button_unlockWallet">
          <Button
            className="full"
            onClick={() => handleTokenApproval(tokenType)}
            disabled={approvalConfirmation}
          >
            {`Approve ${tokenTwo.symbol}`}
          </Button>
        </div>
      );
    }
    //dead code
    return null;
  };

  const calculateLiquidityPercentage = async (reserve) => {
    const _reserve0 = Number(reserve["_reserve0"]) / 10 ** tokenOne.decimals;
    const _reserve1 = Number(reserve["_reserve1"]) / 10 ** tokenTwo.decimals;
    // const amount0 = tokenOneValue - _reserve0;
    // const amount1 = tokenTwoValue - _reserve1;
    const amount0 = tokenOneValue;
    const amount1 = tokenTwoValue;

    let liquidity = 0;
    let _totalSupply = await ContractServices.getTotalSupply(
      currentPairAddress
    );

    let ratio = lpTokenBalance / _totalSupply;
    const t0 = (ratio * _reserve0).toFixed(5);
    setTokenOneDeposit(t0);
    const t1 = (ratio * _reserve1).toFixed(5);
    setTokenTwoDeposit(t1);

    // console.log('total supply--------',t0, t1, _totalSupply);
    if (_totalSupply === 0) {
      liquidity = Math.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
      return 100;
    } else {
      liquidity = Math.min(
        (amount0 * _totalSupply) / _reserve0,
        (amount1 * _totalSupply) / _reserve1
      );
    }
    liquidity = ((liquidity / (_totalSupply + liquidity)) * 100).toFixed(2);
    return liquidity;
  };
  const checkAddLiquidity = async () => {
    if (!isUserConnected) {
      return toast.error(STR_CONSTANT.CONNECT_WALLET);
    }

    if (!tokenOne.address) {
      return toast.error("Select first token!");
    }
    if (!tokenTwo.address) {
      return toast.error("Select second token!");
    }
    if (tokenOneValue <= 0) {
      return toast.error("Enter first token value!");
    }
    if (tokenTwoValue <= 0) {
      return toast.error("Enter second token value!");
    }
    if (!tokenOneApproved) {
      return toast.error("First Token approval is pending!");
    }
    if (!tokenTwoApproved) {
      return toast.error("Second Token approval is pending!");
    }
    console.log(
      tokenOneBalance < tokenOneValue,
      tokenOneBalance,
      tokenOneValue
    );
    if (tokenOneBalance < tokenOneValue) {
      return toast.error(
        `Wallet have insufficient ${tokenOne.symbol} balance!`
      );
    }
    if (tokenTwoBalance < tokenTwoValue) {
      return toast.error(
        `Wallet have insufficient ${tokenTwo.symbol} balance!`
      );
    }
    setShowSupplyModal(!0);
  };

  const addLiquidity = async () => {
    const nwChangeId = localStorage.getItem("staticNwId");
    const key = Math.floor(Math.random() * 100000);
    console.log("HIT");
    dispatch(startLoading());
    const pool_Obj = {
      token1: tokenOne.symbol,
      token2: tokenTwo.symbol,
      token1Addr: tokenOne.address,
      token2Addr: tokenTwo.address,
      nwChangeId: nwChangeId,
      keyId: key,
    };
    console.log("pool_Obj", pool_Obj);
    const acc = await ContractServices.getDefaultAccount();
    if (acc && acc.toLowerCase() !== isUserConnected.toLowerCase()) {
      return toast.error("Wallet address doesn`t match!");
    }
    if (liquidityConfirmation) {
      return toast.info("Transaction is processing!");
    }
    setLiquidityConfirmation(!0);

    let value = 0,
      checkTCRO = !1,
      token;

    let dl = Math.floor(new Date().getTime() / 1000);
    dl = dl + deadline * 60;
    console.log("HIT1");
    if (tokenOne.address === "TCRO") {
      checkTCRO = !0;
      value = tokenOneValue;
      token = tokenTwo.address;
    }
    if (tokenTwo.address === "TCRO") {
      checkTCRO = !0;
      value = tokenTwoValue;
      token = tokenOne.address;
    }
    if (value > 0) {
      value = value * 10 ** 18;
    }
    if (checkTCRO) {
      let amountETHMin = BigNumber(
        Math.floor(Number(value) - (Number(value) * slippagePercentage) / 100)
      ).toFixed();
      let amountTokenMin = "";
      let amountTokenDesired = 0;
      if (tokenOne.address === "TCRO") {
        amountTokenDesired = tokenTwoValue;
        amountTokenMin = BigNumber(
          Math.floor(
            (amountTokenDesired -
              (amountTokenDesired * slippagePercentage) / 100) *
              10 ** tokenTwo.decimals
          )
        ).toFixed();
        amountTokenDesired = BigNumber(
          amountTokenDesired * 10 ** tokenTwo.decimals
        ).toFixed();
      }
      if (tokenTwo.address === "TCRO") {
        amountTokenDesired = tokenOneValue;
        amountTokenMin = BigNumber(
          Math.floor(
            (amountTokenDesired -
              (amountTokenDesired * slippagePercentage) / 100) *
              10 ** tokenOne.decimals
          )
        ).toFixed();
        amountTokenDesired = BigNumber(
          amountTokenDesired * 10 ** tokenOne.decimals
        ).toFixed();
      }
      value = value.toString();
      const data = {
        token,
        amountTokenDesired,
        amountTokenMin,
        amountETHMin,
        to: isUserConnected,
        deadline: dl,
        value,
      };
      try {
        dispatch(startLoading());
        const result = await ExchangeService.addLiquidityETH(data);
        console.log(result, "add liquidity transaction");
        dispatch(stopLoading());
        if (result) {
          setTxHash(result);
          setShowTransactionModal(!0);
          setShowSupplyModal(!1);

          const data = {
            message: `Add ${tokenOne.symbol} and ${tokenTwo.symbol}`,
            tx: result,
          };
          dispatch(addTransaction(data));
          dispatch(checkUserLpTokens(!1));
        }
        setLiquidityConfirmation(!1);
      } catch (err) {
        dispatch(stopLoading());
        const message = await ContractServices.web3ErrorHandle(err);
        toast.error(message);
        setLiquidityConfirmation(!1);
      }
    } else {
      let amountADesired = tokenOneValue;
      let amountBDesired = tokenTwoValue;
      let amountAMin = Math.floor(
        amountADesired - (amountADesired * slippagePercentage) / 100
      );
      let amountBMin = Math.floor(
        amountBDesired - (amountBDesired * slippagePercentage) / 100
      );

      amountADesired = BigNumber(
        amountADesired * 10 ** tokenOne.decimals
      ).toFixed();
      amountBDesired = BigNumber(
        amountBDesired * 10 ** tokenTwo.decimals
      ).toFixed();
      amountAMin = BigNumber(amountAMin * 10 ** tokenOne.decimals).toFixed();
      amountBMin = BigNumber(amountBMin * 10 ** tokenOne.decimals).toFixed();

      let dl = Math.floor(new Date().getTime() / 1000);
      dl = dl + deadline * 60;

      const data = {
        tokenA: tokenOne.address,
        tokenB: tokenTwo.address,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to: isUserConnected,
        deadline: dl,
        value,
      };
      try {
        dispatch(startLoading());
        const w3 = ContractServices.callWeb3();
        const hasPair = isAddr(
          await ExchangeService.getPair(data.tokenA, data.tokenB)
        );
        console.log("add liquidity before", data);
        const tx = await ExchangeService.addLiquidity(data);
        console.log("add liquidity:", tx);
        setShowSupplyModal(1);
        await w3.eth.getTransactionReceipt(tx.transactionHash);
        const txHash = tx.transactionHash;
        dispatch(stopLoading());
        if (txHash) {
          !hasPair && savePoolInfoToDB(pool_Obj, (d) => {});
          setTxHash(txHash);
          setShowTransactionModal(!0);
          setShowSupplyModal(!1);
          const data = {
            message: `Add ${tokenOne.symbol} and ${tokenTwo.symbol}`,
            tx: txHash,
          };
          dispatch(addTransaction(data));
          dispatch(checkUserLpTokens(!1));
        }
        setLiquidityConfirmation(!1);
      } catch (err) {
        dispatch(stopLoading());
        const message = await ContractServices.web3ErrorHandle(err);
        toast.error(message);
        setLiquidityConfirmation(!1);
      }
    }
  };
  const calculateFraction = (tokenType) => {
    let r = 0;
    if (tokenOneValue && tokenTwoValue) {
      if (rEqual(tokenType, TOKEN.A)) {
        if (tokenOneValue === 0) return 0;
        r = tokenTwoValue / tokenOneValue;
      }
      if (rEqual(tokenType, TOKEN.B)) {
        if (tokenTwoValue === 0) return 0;
        r = tokenOneValue / tokenTwoValue;
      }
      return Number(r.toFixed(5));
    } else {
      return 0;
    }
  };

  return (
    <>
      <Card className="">
        <div className="col container_swapwrap__header liquidity_header">
          <Link to="#" onClick={props.backBtn} className="linkBack">
            <img src={awesomeArrowLeft} alt="icon" />
          </Link>
          <h2>Add Liquidity</h2>
        </div>
        <div className="col">
          {firstProvider && (
            <div>
              <p>You are the first liquidity provider.</p>
              <p>
                The ratio of tokens you add will set the price of this pool.
              </p>
              <p>Once you are happy with the rate click supply to review.</p>
            </div>
          )}

          <InputSelectCurrency
            label="From"
            type="number"
            onClick={() => onHandleOpenModal(TOKEN.A)}
            currencyType={tokenOne?.icon ? tokenOne.icon : defaultImg}
            currnecyName={tokenOneCurrency}
            defaultValue={tokenOneValue}
            balance={tokenOneBalance}
            onChange={(e) => handleTokenValue(e.target.value, TOKEN.A)}
            max={!1}
          />
          <div className="Col btnSwap">
            <button className="btnSwapStyle">
              <img src={awesomePlus} alt="icon" />
            </button>
          </div>
          {/* <label className="right">Balance: {tokenTwoBalance}</label> */}
          <InputSelectCurrency
            label="To"
            type="number"
            onClick={() => onHandleOpenModal(TOKEN.B)}
            currencyType={tokenTwo.icon ? tokenTwo.icon : defaultImg}
            currnecyName={tokenTwoCurrency}
            defaultValue={tokenTwoValue}
            balance={tokenTwoBalance}
            onChange={(e) => handleTokenValue(e.target.value, TOKEN.B)}
            max={!1}
          />
        </div>
        {showPoolShare && (
          <div className="kjGbxC">
            <h4>Initial prices and pool share</h4>
            <div className="borderClass">
              <ul className="Liquidityint">
                <li>
                  {calculateFraction(TOKEN.A)} <br /> {tokenTwoCurrency} per{" "}
                  {tokenOneCurrency}
                </li>
                <li>
                  {calculateFraction(TOKEN.B)} <br />
                  {tokenOneCurrency} per {tokenTwoCurrency}{" "}
                </li>
                {/* <li>
                  {sharePoolValue}% <br />
                  Share of Pool
                </li> */}
              </ul>
            </div>
          </div>
        )}
        {/* approval buttons */}
        {handleApprovalButton(TOKEN.A)}
        {handleApprovalButton(TOKEN.B)}

        <div className="col button_unlockWallet">
          <Button
            className="full"
            type="button"
            onClick={() => checkAddLiquidity()}
          >
            {isUserConnected ? "Add Liquidity" : "Unlock Wallet"}
          </Button>
        </div>
        {showSupplyModal && (
          <>
            <div className="backdrop"></div>
            <Card className="selectCurrency_modal">
              <div className="col modal_headerStyle modal_headerbb">
                <div className="row modal_headerStyle__rowA lessMargin_bottom">
                  <div className="col modal_headerStyle__rowA_colRight">
                    <Link to="#" onClick={() => setShowSupplyModal(!1)}>
                      <img src={closeBtn} alt="icon" />
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col tokenList__column borderClassup">
                <h3>You are creating a pool</h3>
                <div className="borderClass ">
                  <div className="lessMargin_bottom">
                    <div className="row">
                      <h2>
                        {tokenOne.symbol}/{tokenTwo.symbol}
                      </h2>

                      <img src={tokenOne.icon} alt="icon" />
                      <img src={tokenTwo.icon} alt="icon" />
                    </div>
                    <p>
                      Output is estimated. If the price changes by more than{" "}
                      {slippagePercentage}% your transaction will revert.
                    </p>
                  </div>
                  <ul>
                    <li>
                      {tokenOneCurrency} Deposit: <span> {tokenOneValue}</span>
                    </li>
                    <li>
                      {tokenTwoCurrency} Deposit:<span>{tokenTwoValue}</span>{" "}
                    </li>
                    <li>
                      Rates
                      <p>
                        {1}&nbsp;{tokenOneCurrency} ={" "}
                        {calculateFraction(TOKEN.A)}
                        &nbsp;{tokenTwoCurrency} <br />
                        {1}&nbsp;{tokenTwoCurrency} ={" "}
                        {calculateFraction(TOKEN.B)}
                        &nbsp;{tokenOneCurrency}
                      </p>
                    </li>
                    <li>
                      Share of Pool: <span>{sharePoolValue}% </span>
                    </li>
                  </ul>
                  <Button
                    className="full"
                    type="button"
                    disabled={liquidityConfirmation}
                    onClick={() => addLiquidity()}
                  >
                    {isUserConnected ? "Create Pool & Supply" : "Unlock Wallet"}
                  </Button>
                </div>
              </div>
            </Card>
          </>
        )}
      </Card>
      {currentPairAddress && (
        <Card className="lp-class">
          <h4>LP Tokens in your Wallet</h4>
          <ul className="LptokensList">
            <li>
              <span>
                <img
                  className="sc-fWPcDo bUpjCL"
                  alt="icon 1"
                  src={tokenOne?.icon}
                />
                <img
                  className="sc-fWPcDo bUpjCL"
                  alt="icon 2"
                  src={tokenTwo?.icon}
                />
                &nbsp;&nbsp;
                {`${tokenOneCurrency}/${tokenTwoCurrency}`}:
              </span>{" "}
              <span>{lpTokenBalance}</span>
            </li>
            <li>
              {tokenOne.symbol}: <span>{tokenOneDeposit}</span>
            </li>
            <li>
              {" "}
              {tokenTwo.symbol}: <span>{tokenTwoDeposit}</span>
            </li>
          </ul>
        </Card>
      )}
      {modalCurrency && (
        <ModalSelectToken
          tokenList={storeDataRedux}
          closeModal={() => setModalCurrency(!modalCurrency)}
          selectCurrency={onHandleSelectCurrency}
          // searchToken={handleSearchToken}
          searchToken={(q) =>
            commonHook.searchTokenByNameOrAddress(q.trim(), isUserConnected)
          }
          searchByName={setSearch}
          tokenType={tokenType}
          currencyName={selectedCurrency}
          onRemoveToken={(_) => {
            setCurrencyNameForTokenOne(INIT_VAL.TOKEN_1);
            setCurrencyNameForTokenTwo(INIT_VAL.TOKEN_2);
          }}
        />
      )}
      {showTransactionModal && (
        <TransactionModal
          closeTransactionModal={closeTransactionModal}
          txHash={txHash}
        />
      )}
    </>
  );
};

export default withRouter(AddLiquidity);
