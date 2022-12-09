import { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarFooter,
} from "react-pro-sidebar";
import "./Sidebar.scss";
import { isMobile } from "react-device-detect";

import anchor_yellow_icon from "../../assets/images/socialicons/anchor-yellow-icon.svg";
import Icon_language from "../../assets/images/Icon_language.svg";
import docsIcon from "../../assets/images/socialicons/Docs.svg";
import githubIcon from "../../assets/images/socialicons/github.svg";
import telegramIcon from "../../assets/images/socialicons/Telegram.svg";
import twitterIcon from "../../assets/images/socialicons/Twitter.svg";
import {
  HOME_ROUTE,
  DOCS_LINK,
  TWITTER_LINK,
  TELEGRAM_LINK,
  AUDIT_LINK,
  STR_CONSTANT,
} from "../../constant";
import {
  ANTI_WHALE,
  AUTOMATIC_BURNING,
  AUTOMATIC_LIQUIDITY,
  BNB_LP,
  BUSD_LP,
  HARVEST_LOCKUP,
  LOTTERY,
  OVERVIEW_LINK,
  ROADMAP,
  TOKEN_LINK,
  ANCHOR_BUSD_LP,
  TUTORIALS,
} from "../../assets/tokens";
import { ExchangeService } from "../../services/ExchangeService";
import { useSelector, useDispatch } from "react-redux";
import { ContractServices } from "../../services/ContractServices";
import { saveDollarValue } from "../../redux/actions/PersistActions";
import { toast } from "../../Components/Toast/Toast";
const Sidebar = (props) => {
  const dispatch = useDispatch();
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const anchorValue = useSelector((state) => state.persist.anchorValue);
  const [selectedOption, setSelectedOption] = useState("");
  const [dollarValue, setAnchorDollarValue] = useState(0.01);
  const location = useLocation();
  const { pathname } = location;
  const splitLocation = pathname.split("/");
  
  const setSideBarOption = (option) => {
    if (selectedOption === option) {
      setSelectedOption("");
      if (isMobile) {
        props.closeSidebar();
      }
    } else {
      if (props.showSocial) {
        if (!isMobile) {
          props.closeSidebar();
        }
      }
      setSelectedOption(option);
    }
  };
  
  useEffect(_ => {
    if (props.showSocial) setSelectedOption('');
    if (isUserConnected) getAnchorDollarValue();
  }, [props.showSocial]);
  
  const AddModal = "/AddModal";
  
  const getAnchorDollarValue = async () => {
    const reserves = await ExchangeService.getReserves(ANCHOR_BUSD_LP);
    let val = reserves[1] / reserves[0];
    val = val || 0;
    dispatch(saveDollarValue(val.toFixed(3)));
    setAnchorDollarValue(val.toFixed(3));
    return;
  };
  const handleOnMobile = () => {
    if (isMobile) {
      props.closeSidebar();
      setSelectedOption("");
    }
  };

  return (
    <ProSidebar className={`sidebar_style ${props.className}`}>
      <Menu iconShape="square">
        <SubMenu
          title="Trade"
          open={selectedOption === "Trade"}
          onOpenChange={() => setSideBarOption("Trade")}
          icon={<i className="trade_nav"></i>}
        >
          <MenuItem
            className={splitLocation[1] === "liquidity" ? "active" : ""}
            onClick={() => handleOnMobile()}
          >
            <Link to={`${HOME_ROUTE}liquidity`}>Liquidity</Link>
          </MenuItem>
        </SubMenu>
        <SubMenu
          title="Add Token"
          icon={<i className="trade_nav"></i>}
          onOpenChange={() => {
            setSideBarOption("Add Token");
          }}
        >
          <MenuItem
            onClick={() => {
              if (!isUserConnected) {
                return toast.error(STR_CONSTANT.CONNECT_WALLET);
              }
            }}
          >
            <Link to={isUserConnected ? "/AddModal" : null}>Add Token</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/tokenList"}>Token List</Link>
          </MenuItem>
          <MenuItem>
            <Link to={"/poolList"}>Pool List</Link>
          </MenuItem>
        </SubMenu>
      </Menu>
    </ProSidebar>
  );
};

export default Sidebar;
