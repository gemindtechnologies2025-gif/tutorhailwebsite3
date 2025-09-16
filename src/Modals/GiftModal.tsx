import { Button, CircularProgress, Modal, TextareaAutosize, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import "react-day-picker/style.css";
import { isNumber, isValidInput } from "../utils/validations";
import { Engagements } from "../constants/enums";
import { useEngagementMutation } from "../service/content";
import { showError, showToast, showWarning } from "../constants/toast";

interface SelectDateProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data:any;
}

// Define a type for your form data
type FormData = {
  amount: string;
  note: string;
};

export default function GiftModal({ open, onClose, setOpen ,data}: SelectDateProps) {
  const [formData, setFormData] = useState<FormData>({
    amount: "",
    note: "",
  });
  console.log(data,'data');
  
const [updateEngagement,{isLoading}] = useEngagementMutation({});
    const handleGift = async () => {
      if(!formData.amount){
        showWarning("Please enter amount")
        return;
      }
       if(!formData.note){
        showWarning("Please add a note")
        return;
      }
      try {
        let body = {
          contentId: data?._id || "",
          engagementType: Engagements.GIFT,
          amount:Number(formData.amount),
          note:formData.note
        };
        const res = await updateEngagement(body).unwrap();
        if (res?.statusCode === 200) {
         
          setOpen(false);
          window.open(res?.data?.link?.redirect_url, "_self");
          setFormData({
            note:"",amount:""
          })
        }
      } catch (error: any) {
        showError(error?.data?.message)
      }
    };

  const handleChange = (
    field: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    // perform payment logic here...
  };

  return (
    <Modal
      className="modal selectDate_modal"
      id="GiftModal"
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={onClose}
    >
      <div className="modal-dialog">
        <div className="modal-body">
          <div className="btn-close">
            <CloseIcon onClick={() => {setOpen(false);setFormData({amount:'',note:""})}} />
          </div>
          <div className="abt_profile_sc gift_mdl">
            <div className="title_md">
              <h2>Send Gift</h2>
              <figure>
                <img src={data?.user?.image|| `/static/images/emili.png`} alt="emili" />
              </figure>
              <p> Paying {data?.user?.name||"user"}</p>

            </div>
              <form className="form_group" onSubmit={handleSubmit}>
                <div style={{ width: "60%" }} className="input_group">
                  <TextField
                    id="amount"
                    label="Enter Amount"
                    variant="standard"
                    value={formData.amount}
                    inputProps={{maxLength:8}}
                    onChange={(e) => {
                      if (isNumber(e.target.value)) handleChange("amount", e);
                    }}
                  />
                </div>
                <div style={{ width: "100%" }} className="input_group ">
                  <TextareaAutosize
                    minRows={4}
                    style={{ width: "100%" }}
                    placeholder="Add note.."
                   
                    value={formData.note}
                    onChange={(e) => {
                      if (isValidInput(e.target.value)) handleChange("note", e);
                    }}
                  />
                </div>
                <button onClick={handleGift} type="submit" className="btn primary">
                  { isLoading ? <CircularProgress size={15} color="info" /> : "Proceed to pay"}
                </button>
              </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
