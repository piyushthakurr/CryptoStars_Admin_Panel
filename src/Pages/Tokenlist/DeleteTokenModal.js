import React from "react";
import { Button } from "react-bootstrap";
import Card from "../../Components/Card/Card";
import "../../Components/ProfileModal/ProfileModal.scss";
import { deletTokenApiData } from "../../services/api";

function DeleteModal(props) {
  console.log("Propsssssssss", props);
  return (
    <>
      <center>
        <Card className="profile_modal">
          <div className="col modal_headerStyle">
            <div>
              <h2>Delete Token</h2>
            </div>
          </div>
          <h4>Are you sure? </h4>
          <h4> You want to delete this Token?</h4>
          <Button
            style={{ cursor: "pointer" }}
            onClick={async () => {
              props.setOpenModal(!1);
              const resp = await deletTokenApiData(props.data);
              console.log("respppppp", resp);
              if (resp) {
                window.location.reload();
              }
            }}
          >
            Yes
          </Button>
          <Button
            style={{ cursor: "pointer", marginLeft: "20px" }}
            onClick={() => props.setOpenModal(!1)}
          >
            No
          </Button>
          <br />
          <br />
          <br />
        </Card>
      </center>
    </>
  );
}

export default DeleteModal;
