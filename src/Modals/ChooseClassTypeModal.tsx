import { Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

interface WithdrawProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ChooseClassTypeModal({
  open,
  onClose,
  setOpen,
}: WithdrawProps) {
  return (
    <>
      <Modal
        className="modal withdraw_modal"
        id="withdrawModal"
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        open={open}
        onClose={(event, reason) => {
          if (reason !== "backdropClick") {
            onClose();
          }
        }}
      >
        <div className="modal-dialog">
          <div className="modal-body">
            <div className="btn-close">
              <CloseIcon onClick={onClose} />
              {/* <CloseIcon onClick={() => navigate(`/parent/tutor-detail/${id}`)} /> */}
            </div>
            <h2>Please Choose a Class Mode</h2>
            <div className="form_btn">
              <Button
                style={{
                  borderRadius: "10px",
                  background: "#05A633",  
                  color: "white",
                  border: "none",
                }}
                variant="outlined"
                color="primary"
              >
                Online
              </Button>
              <Button
                style={{
                  borderRadius: "10px",
                  background: "#05A633",
                  color: "white",
                  border: "none",
                }}
                variant="outlined"
                color="primary"
              >
                Offline
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
