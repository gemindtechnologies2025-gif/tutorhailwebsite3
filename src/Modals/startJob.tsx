import { Modal } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import OTPInput from "react-otp-input";

interface StartJobProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  otp: string;
  setOtp: Dispatch<SetStateAction<string>>;
  handleVerifyOtp: () => Promise<void>;
}

export default function StartJobModal({
  open,
  onClose,
  setOpen,
  otp,
  setOtp,
  handleVerifyOtp,
}: StartJobProps) {
  return (
    <Modal
      className="modal startJob_modal"
      id="startJobModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => setOpen(false)} />
          </div>
          <h2>Enter OTP to Start Job</h2>
          <p>
            Please enter the OTP provided by the parent to begin your tutoring
            session.
          </p>
          <form className="form">
            <div className="control_group opt_fields">
              <OTPInput
                value={otp}
                onChange={setOtp}
                numInputs={4}
                renderInput={(props) => <input {...props} />}
                inputType="tel"
                shouldAutoFocus
              />
            </div>
            <div className="form_btn">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpen(false);
                  setOtp("");
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  handleVerifyOtp();
                }}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
