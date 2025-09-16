import { IconButton, InputAdornment, Modal, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import AddIcon from "@mui/icons-material/Add";

interface CurriculumProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedCurriculam: Dispatch<SetStateAction<number[]>>;
  other: string;
  setOther: Dispatch<SetStateAction<string>>;
  selectedCurriculam: number[];
}

export default function CurriculumModal({
  open,
  onClose,
  setOpen,
  setSelectedCurriculam,
  other,
  setOther,
  selectedCurriculam,
}: CurriculumProps) {
  const [show, setShow] = useState<boolean>(false);

  const handleCurriculumChange = (value: number, checked: boolean) => {
    if (checked) {
      setSelectedCurriculam((prev) => {
        return Array.isArray(prev) ? [...prev, value] : [value];
      });
    } else {
      setSelectedCurriculam((prev) => {
        return Array.isArray(prev)
          ? prev?.filter((item) => item !== value)
          : [];
      });
    }
  };

  const isChecked = (value: number) => {
    return selectedCurriculam?.includes(value);
  };

  return (
    <Modal
      className="modal setup_modal"
      id="curriculumModal"
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
          <h2>Select Curriculum</h2>
          <form className="form">
            <div className="control_group">
              <FormGroup className="checkbox_label">
                <FormControlLabel
                  value={1}
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleCurriculumChange(1, e.target.checked)
                      }
                      checked={isChecked(1)}
                    />
                  }
                  label="National Curriculum "
                />
                <FormControlLabel
                  value={2}
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleCurriculumChange(2, e.target.checked)
                      }
                      checked={isChecked(2)}
                    />
                  }
                  label="Cambridge Curriculum"
                />
                <FormControlLabel
                  value={3}
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleCurriculumChange(3, e.target.checked)
                      }
                      checked={isChecked(3)}
                    />
                  }
                  label="IB Curriculum"
                />
                <FormControlLabel
                  value={4}
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleCurriculumChange(4, e.target.checked)
                      }
                      checked={isChecked(4)}
                    />
                  }
                  label="American Curriculum"
                />
                <FormControlLabel
                  control={
                    <Checkbox onChange={(e) => setShow(e.target.checked)} />
                  }
                  label="Other"
                />
                {show ? (
                  <div className="addMore">
                    <TextField
                      hiddenLabel
                      fullWidth
                      placeholder="Add Curriculum"
                      value={other}
                      onChange={(e) => setOther(e.target.value)}
                      // InputProps={{
                      //     endAdornment: (
                      //         <InputAdornment className="add_icon" position="end">
                      //             <IconButton onClick={handleAddOther} >
                      //                 <AddIcon />
                      //             </IconButton>
                      //         </InputAdornment>
                      //     ),
                      // }}
                    />
                  </div>
                ) : (
                  ""
                )}
              </FormGroup>
            </div>
            <div className="form_btn">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpen(false);
                  setSelectedCurriculam([]);
                  setOther("");
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  setOpen(false);
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
