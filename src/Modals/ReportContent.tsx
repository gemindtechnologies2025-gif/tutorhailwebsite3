import {
  Button,
  CircularProgress,
  MenuItem,
  Modal,
  Select,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import "react-day-picker/style.css";
import { isNumber, isValidInput } from "../utils/validations";
import { Engagements, REPORT } from "../constants/enums";
import {
  useEngagementMutation,
  useReportContentMutation,
} from "../service/content";
import { showError, showToast, showWarning } from "../constants/toast";

interface SelectDateProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: any;
}

// Define a type for your form data
type FormData = {
  report: string;
  note: string;
};

export default function ReportContentModal({
  open,
  onClose,
  setOpen,
  data,
}: SelectDateProps) {
  const [formData, setFormData] = useState<FormData>({
    report: "",
    note: "",
  });

  const [updateEngagement, { isLoading }] = useReportContentMutation({});
  const handleGift = async () => {
    if (!formData.report) {
      showWarning("Please select reason");
      return;
    }
   
    try {
      let body = {
        contentId: data?._id || "",
        report:Number(formData?.report),
        ...(formData?.note ? {reason:formData?.note}:{})
      };
      
      const res = await updateEngagement({ body }).unwrap();
      if (res?.statusCode === 200) {
        setOpen(false);
        showToast("Report Submitted Successfully")
        setFormData({
          note: "",
          report: "",
        });
      }
    } catch (error: any) {
      showError(error?.data?.message);
    }
  };

  const handleChange = (
    field: keyof FormData,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement >|any
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
            <CloseIcon
              onClick={() => {
                setOpen(false);
                setFormData({ report: "", note: "" });
              }}
            />
          </div>
          <div className="abt_profile_sc  report_mdl">
            <div className="title_md m-0">
              <h2>Report</h2>
            </div>
              <form className="form_group" onSubmit={handleSubmit}>
                <div style={{ width: "100%" }} className="input_group">
                  <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={formData.report}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleChange("report", e);
                      }
                    }}
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Reason
                    </MenuItem>

                    <MenuItem value={REPORT.NUDITY_SEXUAL}>Nudity / Sexual Content</MenuItem>
                    <MenuItem value={REPORT.VIOLENCE_HARMFUL_BEHAVIOR}>Voilence / Harmful Behaviour</MenuItem>
                    <MenuItem value={REPORT.MISINFORMATION_FAKE_NEWS}>Misinformation / Fake News</MenuItem>
                    <MenuItem value={REPORT.HARASSMENT_HATE_SPEECH}>Harassment / Hate Speech</MenuItem>
                    <MenuItem value={REPORT.SPAM_SCAMS}>Spam / Scams</MenuItem>
                    <MenuItem value={REPORT.COPYRIGHT_INFRINGEMENT}>Copyright Infringement</MenuItem>
                    <MenuItem value={REPORT.CHILD_SAFETY_VIOLATIONS}>Child Safety Violations</MenuItem>
                    
                  </Select>
                </div>
                <div style={{ width: "100%" }} className="input_group">
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
                <button
                  onClick={handleGift}
                  type="submit"
                  className="btn primary"
                >
                  {isLoading ? (
                    <CircularProgress size={15} color="inherit" />
                  ) : (
                    "Submit"
                  )}
                </button>
              </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}
