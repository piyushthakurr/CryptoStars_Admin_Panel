import { URL, VAL_CONSTANT } from "../constant";
import { API_PATH } from "./constants";
import { jObject, jString } from "./utils";

function saveTokenInfoToDB(tokenInfo, callback) {
  console.log(URL.API_BACKEND, API_PATH.SAVE_TOKEN_INFO);
  console.log("tokenInfo-------1", tokenInfo);

  fetch(`${URL.API_BACKEND}${API_PATH.SAVE_TOKEN_INFO}`, {
    method: "POST",
    // data: JSON.stringify(tokenInfo),
    body: JSON.stringify(tokenInfo),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((d) => {
      console.log("sucess saving token info");
      callback(d);
    })
    .catch((err) => {
      console.log("saveTokenInfoToDB Error:", err);
    });
}

function saveTokenIconToDB(file, iconName, callback) {
  console.log("HIT SAVE TOKEN ICON");
  const imgData = new FormData();
  console.log("fff", file);
  imgData.append("token_icon", file);

  fetch(URL.API_BACKEND + "/api/save/tokenIcon", {
    method: "POST",
    // headers: {'Content-Type': 'multipart/form-data'},
    body: imgData,
  })
    .then((r) => r.json())
    .then((r) => callback(null, r))
    .catch((er) => callback(er, null));
}

async function retreiveTokenList(callback) {
  try {
    let getResult = await fetch(URL.API_BACKEND + "/api/get/tokenInfoList", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    });
    getResult = await getResult.json();
    let apiData = jObject(getResult.data);
    console.log("getResultttttttttt", apiData);
    const nwChangeId = localStorage.getItem("staticNwId");
    apiData = apiData.filter((obj) => {
      return obj.nwChangeId == nwChangeId;
    });
    console.log("filterapiData", apiData);
    return apiData;
  } catch (error) {
    console.log("retrieveTokenList Error:", error);
  }
}

const retrieveTokenListCall = retreiveTokenList;

function savePoolInfoToDB(poolInfo, callback) {
  console.log(URL.API_BACKEND, API_PATH.SAVE_POOL_INFO, "yoooo");
  console.log("tokenInfo-------", poolInfo);

  fetch(`${URL.API_BACKEND}${API_PATH.SAVE_POOL_INFO}`, {
    method: "POST",
    body: JSON.stringify(poolInfo),
    headers: {
      "content-type": "application/json",
    },
  })
    .then((d) => {
      console.log("sucess saving token info");
      callback(d);
    })
    .catch((err) => {
      console.log("savePoolInfoToDB Error:", err);
    });
}

function retreivePoolInfoList(callback) {
  const nwChangeId = localStorage.getItem("staticNwId");
  console.log("nwChangeId88", nwChangeId);
  fetch(URL.API_BACKEND + "/api/get/poolInfoList", {
    method: "GET",
    headers: {
      "content-type": "application/json",
    },
  })
    .then((d) => d.json())
    .then((res) => {
      let poolInfoList = JSON.parse(res.data);
      console.log("vvvvvvvpoolInfoList", poolInfoList);
      poolInfoList = poolInfoList.filter((obj) => {
        return obj.nwChangeId == nwChangeId;
      });
      console.log("vvvvvvvpoolInfoListfilter", poolInfoList);
      callback(poolInfoList);
    })
    .catch((err) => {
      console.log("retreivePoolInfoList Error", err);
    });
}

function retrieveProjectVersion() {
  return new Promise((r, j) => {
    fetch(API_PATH.PROJECT_VERSION, {
      method: "POST",
      body: jString({
        projectId: VAL_CONSTANT.PROJECT_ID,
      }),
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => r(res.data))
      .catch((er) => j(er));
  });
}

function deletPoolApiData(data) {
  console.log("PoolData", data);
  return new Promise((r, j) => {
    fetch(URL.API_BACKEND + `/api/delete/deletePoolInfo/${data.id}`, {
      method: "DELETE",
      body: jString({
        key: data.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log("pppppppp", r(res.data)))
      .catch((er) => j(er));
  });
}

function deletTokenApiData(data) {
  console.log("PoolData", data);
  return new Promise((r, j) => {
    fetch(URL.API_BACKEND + `/api/delete/deleteToken/${data.id}`, {
      method: "DELETE",
      body: jString({
        key: data.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => console.log("pppppppp", r(res.data)))
      .catch((er) => j(er));
  });
}

export {
  savePoolInfoToDB,
  retreiveTokenList,
  retrieveTokenListCall,
  saveTokenInfoToDB,
  saveTokenIconToDB,
  retreivePoolInfoList,
  retrieveProjectVersion,
  deletPoolApiData,
  deletTokenApiData,
};
