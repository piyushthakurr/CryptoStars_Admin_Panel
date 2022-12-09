import React, { useEffect, useState } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { useLocation, withRouter } from "react-router";
import Header from "../../Components/Header/Header";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Home from "../../Pages/Public/Home/Home";
import Swap from "../../Pages/Public/Swap/Swap";
import Liquidity from "../../Pages/Public/Liquidity/Liquidity";
import Farm from "../../Pages/Public/Farm";
import Oceans from "../../Pages/Public/Oceans/Oceans";
import Lottery from "../../Pages/Public/Lottery/Lottery";
import { HOME_ROUTE } from "../../constant";
import Pools from "../../Pages/Public/Pools/Pools";
import AddTokenModal from "../../Components/AddTokenModal/AddTokenModal";
import Referrals from "../../Pages/Public/Referrals/Referrals";
import ReactGA from "react-ga";
import './Publicrouter.scss'
import { useSelector } from 'react-redux';
import { TokenList } from "../../Pages/Tokenlist/TokenList";
import CryptoStarHome from "../../Pages/Public/Home/CryptoStarHome";
import ConnectWalletModal from "../../Components/Connect/ConnectWalletModal";
import LiquidityPoolList from "../../Pages/Public/Liquidity/LiquidityPoolList";

const PublicRoutes = () => {
  const location = useLocation();
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);

  useEffect(() => {
    ReactGA.initialize("UA-203869190-3");
    ReactGA.pageview(location.pathname + location.search);
  }, [location]);

  const [small, setSmall] = useState(false);
  const [navCollapse, setNavCollapse] = useState(false);
  const [tradeDropdown, openCloseTradeDropdown] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", () =>
        setSmall(window.pageYOffset > 200)
      );
    }
  }, []);

  const handleNavCollapse = () => {
    setNavCollapse((prevNavCollapse) => !prevNavCollapse);
    if (navCollapse === false) {
      document.body.className = "expande_container";
      // return () => { document.body.className = ''; }
    } else {
      document.body.className = "";
    }
  };

  const handleSubNav = () => {
    setNavCollapse((prevNavCollapse) => prevNavCollapse);
  };

  return (
    <>
      {isUserConnected &&
      <>
       <Header
        className={`fixed ${small ? "isFixed" : ""}`}
        small_nav={() => handleNavCollapse()}
        mobileIcon={navCollapse}
      />
      <Sidebar
        className={`fixed ${small ? "isFixed" : ""} ${
          navCollapse ? "small_nav" : ""
        }`}
        showSocial={navCollapse}
        onClickOpenSidebar={() => handleSubNav()}
        closeSidebar={() => {
          handleNavCollapse();
        }}
        tradeDropdown={() => {
          if (navCollapse === true) {
            alert("collapsed");
            handleNavCollapse();
          }
        }}
        // tradeDropdown={!tradeDropdown}
        onOpenChange={(open) => {
          alert("fd");
          openCloseTradeDropdown(!open);
        }}
      />
      </>}
      {isUserConnected?
      <Switch>
        <Route path={{HOME_ROUTE}} component={CryptoStarHome} exact={true} />
        {/* <Route path={`${HOME_ROUTE}` component={Liquidity} exact={true} /> */}
        <Route
          path={`${HOME_ROUTE}addmodal`}
          component={AddTokenModal}
          exact={true}
        />
        {/* <Route path={`${HOME_ROUTE}home`} component={Home} exact={true} /> */}
        <Route path={`${HOME_ROUTE}swap`} component={Swap} exact={true} />
        <Route
          path={`${HOME_ROUTE}liquidity`}
          component={Liquidity}
          exact={true}
        />
        <Route path="/tokenList" component={TokenList} exact={true} />
        <Route
          path={`${HOME_ROUTE}referrals`}
          component={Referrals}
          exact={true}
        />
        <Route path={`${HOME_ROUTE}farm`} component={Farm} exact={true} />
        <Route path={`${HOME_ROUTE}oceans`} component={Oceans} exact={true} />
        <Route path={`${HOME_ROUTE}lottery`} component={Lottery} exact={true} />
        <Route path={`${HOME_ROUTE}pools`} component={Pools} exact={true} />
        <Route path={`${HOME_ROUTE}poolList`} component={LiquidityPoolList} exact={true} />
      </Switch> 
      : 
      <>
      <CryptoStarHome/> 
      </>}
    </>
  );
};

export default withRouter(PublicRoutes);
