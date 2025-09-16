import { Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

interface GradesProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<string[]>>;
  selected: string[];
  listing: any[];
}

export default function CategoryModal({
  open,
  onClose,
  setOpen,
  setSelected,
  selected,
  listing,
}: GradesProps) {
  const handleGradeChange = (value: string, checked: boolean) => {
    if (checked) {
      // add to selected
      setSelected((prev) => [...prev, value]);
    } else {
      // remove from selected
      setSelected((prev) => prev.filter((id) => id !== value));
    }
  };

  const isChecked = (value: string) => {
    return selected.includes(value);
  };

  return (
    <Modal
      className="modal setup_modal"
      id="gradesModal"
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
          <h2>Select categories</h2>
          <form className="form">
            <div className="control_group">
              <FormGroup className="checkbox_label">
                {listing?.map((option) => (
                  <FormControlLabel
                    key={option?._id}
                    control={
                      <Checkbox
                        onChange={(e) =>
                          handleGradeChange(option?._id, e.target.checked)
                        }
                        checked={isChecked(option?._id)}
                      />
                    }
                    label={option?.name}
                  />
                ))}
              </FormGroup>
            </div>
            <div className="form_btn">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpen(false);
                  setSelected([]); // clear all on cancel
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onClick={() => setOpen(false)}>
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
}
