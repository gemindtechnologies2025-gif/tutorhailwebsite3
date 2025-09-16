import { Button, Modal } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import "react-day-picker/style.css";
import moment from "moment";
import useAuth from "../hooks/useAuth";
interface SelectDateProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;

}

export default function SocialModal({
  open,
  onClose,
  setOpen,

}: SelectDateProps) {
  const user=useAuth();
  
  return (

    <Modal
      className="modal selectDate_modal"
      id="SocialModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={()=>{
        // handleResetClick();
        onClose();
      }}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => {setOpen(false);}} />
          </div>
           <div className="abt_profile_sc social_mdl">
            <div className="title_md">  
              <h2>About Profile</h2>
            </div>
            <ul>
              <li>
                <p>
                  Joined <span>{user?.createdAt ? moment(user?.createdAt).format("LL"):""}</span>
                </p>
              </li>
              <li>
                <p>
                  Profile <span> Updated {moment(user?.updatedAt).fromNow()}</span>
                </p>
              </li>
             
            </ul>
          </div>
        </div>
      </div>
    </Modal>
  );
}
