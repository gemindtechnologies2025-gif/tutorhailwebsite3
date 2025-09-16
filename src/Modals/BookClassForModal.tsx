import {
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Button from "@mui/material/Button";
import { useNavigate, useParams } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import { isValidInput } from "../utils/validations";
import { BOOK_FOR, CLASS_BOOK, ClassMode } from "../constants/enums";
import { useBookClassMutation } from "../service/class";
import { showError } from "../constants/toast";

interface PaymentSuccessfulProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  slots: string[];
  classMode: any;
}

export default function BookForModal({
  open,
  onClose,
  setOpen,
  slots,
  classMode,
}: PaymentSuccessfulProps) {
  const navigate = useNavigate();
  const [paymentFor, setPaymentFor] = useState<number>(BOOK_FOR.MYSELF);
  const [otherName, setOtherName] = useState("");
  const [otherEmail, setOtherEmail] = useState("");
  const { id } = useParams();
  const [mode, setMode] = useState<number>(ClassMode.ONLINE);

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentFor(Number(event.target.value));
  };
  const handleRadioChangeMode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMode(Number(event.target.value));
  };
  const [bookClass] = useBookClassMutation();

  const BookClassFunc = async () => {
    if (paymentFor == BOOK_FOR.OTHER && otherName == "") {
      showError("Name is required");
      return;
    }
    if (paymentFor == BOOK_FOR.OTHER && otherEmail == "") {
      showError("Email is required");
      return;
    }
    const body = {
      bookClassId: id,
      classSlotIds: slots || [],
      bookFor: paymentFor,
      classModeOnline:classMode==ClassMode.ONLINE  ||(classMode== ClassMode.HYBRID && mode == ClassMode.ONLINE) ?  true : false,
      slotType: CLASS_BOOK.SLOTS,
      ...(paymentFor == BOOK_FOR.OTHER ? { name: otherName } : {}),
      ...(paymentFor == BOOK_FOR.OTHER ? { email: otherEmail } : {}),
    };
    console.log(body, "body.....");

    try {
      const res = await bookClass({ body: body, isCartScreen: true }).unwrap();

      if (res?.statusCode === 200) {
        navigate(`/parent/PaymentDetails/${id}`, { state: {data:res?.data,body:body} });
      }
    } catch (error: any) {
      showError(error?.data?.message || "something went wrong");
    }
  };

  return (
    <Modal
      className="modal success_modal"
      id="paymentSuccessfulModal"
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

          {classMode == ClassMode.HYBRID ? (
            <div>
              <h5>Select Class Mode</h5>
              <RadioGroup
                value={mode}
                onChange={handleRadioChangeMode}
                style={{ marginBottom: "1rem" }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-evenly" }}
                >
                  <FormControlLabel
                    value={ClassMode.ONLINE}
                    control={<Radio />}
                    label="Online"
                  />
                  <FormControlLabel
                    value={ClassMode.OFFLINE}
                    control={<Radio />}
                    label="Offline"
                  />
                </div>
              </RadioGroup>
            </div>
          ) : null}

          <div>
            <h5>Select Person </h5>
            <RadioGroup
              value={paymentFor}
              onChange={handleRadioChange}
              style={{ marginBottom: "1rem" }}
            >
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <FormControlLabel
                  value={BOOK_FOR.MYSELF}
                  control={<Radio />}
                  label="Pay for yourself"
                />
                <FormControlLabel
                  value={BOOK_FOR.OTHER}
                  control={<Radio />}
                  label="Pay for someone else"
                />
              </div>
            </RadioGroup>
          </div>

          {paymentFor === BOOK_FOR.OTHER ? (
            <>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                value={otherName}
                onChange={(e) => {
                  if (isValidInput(e.target.value))
                    setOtherName(e.target.value);
                }}
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                value={otherEmail}
                onChange={(e) => {
                  if (isValidInput(e.target.value))
                    setOtherEmail(e.target.value);
                }}
              />
            </>
          ) : null}

          <Button
            className="btn primary"
            fullWidth
            style={{ marginTop: "1rem" }}
            onClick={BookClassFunc}
            // onClick={() => navigate("/parent/PaymentDetails")}
          >
            Next
          </Button>
        </div>
      </div>
    </Modal>
  );
}
