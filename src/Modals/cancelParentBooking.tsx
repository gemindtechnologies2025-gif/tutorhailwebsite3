import React from "react";
import { Modal, TextField, Checkbox, Box } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";

import { showError, showToast, showWarning } from "../constants/toast";
import { useCancelBookingMutation } from "../service/booking";
import { useNavigate } from "react-router-dom";

interface CancelBookingProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: string | undefined;
}

export default function CancelParentBooking({
  open,
  onClose,
  setOpen,
  id,
}: CancelBookingProps) {
  const navigate = useNavigate(); // navigation hook
  const [reason, setReason] = useState<string>("");
  const [updateBookingApi] = useCancelBookingMutation();
  const [check, setCheck] = useState<boolean>(false);

  const handleChange = () => {
    setCheck((prev) => !prev);
  };

  const RejectMutation = async () => {
    if (!reason) {
      showWarning("Enter cancellation reason");
      return;
    }
    const body = {
      cancelReason: reason,
    };
    try {
      const res = await updateBookingApi({
        body: body,
        id: id,
      }).unwrap();
      if (res?.statusCode === 200) {
        showToast("Booking canceled successfully");
        setOpen(false);
        navigate("/parent/my-bookings");
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  return (
    <Modal
      className="modal cancel_modal"
      id="cancelBookingModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={() => {
        setReason("");
        onClose();
      }}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => setOpen(false)} />
          </div>
          <h2>Enter reason for cancellation</h2>
          <p>
            We use your feedback to better improve the quality of service you
            receive .
          </p>
          <form className="form">
            <div className="control_group">
              <TextField
                fullWidth
                hiddenLabel
                placeholder="Enter reason for cancellation..."
                minRows="5"
                multiline
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></TextField>
            </div>
            <Box display={"flex"} alignItems={"center"}>
              <Checkbox
                checked={check}
                onChange={handleChange}
                name="agree"
                color="success"
              />

              <p>
                I agree to the{" "}
                <span
                  onClick={() => navigate("/refund-policy")}
                  style={{
                    textDecoration: "underline",
                    color: "green",
                    cursor: "pointer",
                  }}
                >
                  refund policy
                </span>{" "}
              </p>
            </Box>

            <div className="form_btn">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpen(false);
                  setReason("");
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                color={!check ? "warning" : "success"}
                disabled={!check}
                onClick={RejectMutation}
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
