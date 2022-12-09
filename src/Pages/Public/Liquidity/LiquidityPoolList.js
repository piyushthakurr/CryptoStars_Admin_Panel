import React, { useEffect, useState } from "react";
import { retreivePoolInfoList, deletPoolApiData } from "../../../services/api";
import "./LiquidityPoolList.scss";
import { ExchangeService } from "../../../services/ExchangeService";
import { ContractServices } from "../../../services/ContractServices";
import { MAIN_CONTRACT_LIST } from "../../../assets/tokens";
import { useSelector } from "react-redux";
import DeleteModal from "./DeletePoolModal";
import { Button, Table } from "react-bootstrap";

const LiquidityPoolList = () => {
  const isUserConnected = useSelector((state) => state.persist.isUserConnected);
  const [poolList, setPoolList] = useState([]);
  const [pairBalance, setPairBalance] = useState([]);
  const [openModal, setOpenModal] = useState(!1);
  const [poolId, setPoolId] = useState();
  console.log("openModal", openModal);

  useEffect(() => {
    newPoolList();
  }, []);

  useEffect(() => {
    pairCall();
  }, [poolList]);

  //Fetching list from backend
  const newPoolList = () => {
    retreivePoolInfoList((poolInfoList) => {
      console.log("poolInfoList", poolInfoList);
      setPoolList([...poolInfoList]);
    });
  };
  console.log("poolListTTTTTTTTT", poolList);

  const pairCall = async () => {
    let pairBalArr = [];

    const getBal = (i) => {
      console.log("pool list: i", i);
      console.log("poolList.length", poolList.length);
      if (i === poolList.length) {
        return setPairBalance([...pairBalArr]);
      }
      ExchangeService.getPair(
        poolList[i].token1Addr,
        poolList[i].token2Addr
      ).then((pair) => {
        console.log("ExchangeServicepair:", pair);
        ContractServices.callContract(pair, MAIN_CONTRACT_LIST.pair.abi).then(
          (c) => {
            c.methods
              .balanceOf(isUserConnected)
              .call()
              .then((bal) => {
                pairBalArr.push((bal / 10 ** 18).toFixed(4));
                getBal(i + 1);
              });
          }
        );
      });
    };
    poolList.length && getBal(0);
  };

  async function deletePoolData(data) {
    console.log("delete function call", data);
    setPoolId(data);
    // const resp = await deletPoolApiData(data);
    // window.location.reload();
    // console.log("respppppppppppp", resp);
  }

  return (
    <>
      <div className="liquidity__content container_swapwrap ">
        <div className="pool-list--container">
          <div className="table-responsive">
            <Table>
              <thead>
                <tr>
                  <th>POOL</th>
                  <th>LP BALANCE</th>
                  <th>DELETE POOL</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                  <td>CST/CROO</td>
                  <td>765,8</td>
                  <td>
                    <Button
                      onClick={() => {
                        deletePoolData({ id: token.keyId });
                        setOpenModal(!0);
                      }}
                    >
                      Delete Pool
                    </Button>
                  </td>
                </tr> */}
                {poolList?.map(
                  (token, i) => (
                    console.log("IIIIIIIII", token),
                    (
                      <tr>
                        <td>
                          <span>
                            {token.token1} / {token.token2}
                          </span>
                        </td>
                        <td>
                          <span>{pairBalance[i]}</span>
                        </td>
                        <td>
                          <span>
                            <Button
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                deletePoolData({ id: token.keyId });
                                setOpenModal(!0);
                              }}
                            >
                              Delete
                            </Button>
                          </span>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </Table>
          </div>
        </div>
      </div>
      {openModal ? (
        <DeleteModal setOpenModal={setOpenModal} data={poolId} />
      ) : null}
    </>
  );
};

export default LiquidityPoolList;
