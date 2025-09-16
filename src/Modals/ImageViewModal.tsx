import {  Modal } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { ZoomInIcon, ZoomOutIcon } from "lucide-react";

interface SelectDateProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  image: string;
}

export default function ImageViewModal({
  open,
  onClose,
  setOpen,
  image,
}: SelectDateProps) {

  return (
    <Modal
      className="modal selectDate_modal"
      id="AboutProfile"
      open={open}
      onClose={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="modal_title hd_3_1">
          
            <div className="btn-close">
              <CloseIcon
                onClick={() => {
                  setOpen(false);
                }}
              />
            </div>
          </div>

          <div className="img_wrapper">
            <img
              src={image}
              alt="img preview"
              style={{
                transition: "transform 0.3s ease",
                maxWidth: "100%",
                maxHeight: "80vh",
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
