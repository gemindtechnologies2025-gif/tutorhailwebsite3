import { Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { GRADE_TYPE, GRADE_TYPE_NAME } from "../constants/enums";

type Conversion = { name: string };

interface GradesProps {
  open: boolean;
  onClose: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setSelected: Dispatch<SetStateAction<any[]>>;
  selected: any[];
}

export default function GradesModal({
  open,
  onClose,
  setOpen,
  setSelected,
  selected,
}: GradesProps) {

  const handleGradeChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelected((prev) => {
        return Array.isArray(prev) ? [...prev, Number(value)] : [Number(value)];
      });
    } else {
      setSelected((prev) => {
        return Array.isArray(prev)
          ? prev.filter((item) => item !== Number(value))
          : [];
      });
    }
  };

  const isChecked = (value: string) => {
    return selected?.includes(Number(value));
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
          <h2>Select Grades You Teach</h2>
          <form className="form">
            <div className="control_group">
              <FormGroup className="checkbox_label">
                <b> Early Childhood</b>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleGradeChange(
                          String(GRADE_TYPE.PRE_K),
                          e.target.checked
                        )
                      }
                      checked={isChecked(String(GRADE_TYPE.PRE_K))}
                    />
                  }
                  label={GRADE_TYPE_NAME[1]}
                />
                <b>Elementary</b>
                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleGradeChange(
                          String(GRADE_TYPE.KINDERGARTEN),
                          e.target.checked
                        )
                      }
                      checked={isChecked(String(GRADE_TYPE.KINDERGARTEN))}
                    />
                  }
                  label={GRADE_TYPE_NAME[2]}
                />

                {Array.from({ length: 5 }, (_, i) => {
                  const gradeValue =
                    GRADE_TYPE[`GRADE_${1 + i}` as keyof typeof GRADE_TYPE]; // from GRADE_3 to GRADE_12
                  return (
                    <FormControlLabel
                      key={gradeValue}
                      control={
                        <Checkbox
                          onChange={(e) =>
                            handleGradeChange(
                              String(gradeValue),
                              e.target.checked
                            )
                          }
                          checked={isChecked(String(gradeValue))}
                        />
                      }
                      label={GRADE_TYPE_NAME[gradeValue]}
                    />
                  );
                })}

                <b>Middle School</b>

                {Array.from({ length: 3 }, (_, i) => {
                  const gradeValue =
                    GRADE_TYPE[`GRADE_${6 + i}` as keyof typeof GRADE_TYPE]; // from GRADE_3 to GRADE_12
                  return (
                    <FormControlLabel
                      key={gradeValue}
                      control={
                        <Checkbox
                          onChange={(e) =>
                            handleGradeChange(
                              String(gradeValue),
                              e.target.checked
                            )
                          }
                          checked={isChecked(String(gradeValue))}
                        />
                      }
                      label={GRADE_TYPE_NAME[gradeValue]}
                    />
                  );
                })}
                <b>High School</b>

                {Array.from({ length: 4 }, (_, i) => {
                  const gradeValue =
                    GRADE_TYPE[`GRADE_${9 + i}` as keyof typeof GRADE_TYPE]; // from GRADE_3 to GRADE_12
                  return (
                    <FormControlLabel
                      key={gradeValue}
                      control={
                        <Checkbox
                          onChange={(e) =>
                            handleGradeChange(
                              String(gradeValue),
                              e.target.checked
                            )
                          }
                          checked={isChecked(String(gradeValue))}
                        />
                      }
                      label={GRADE_TYPE_NAME[gradeValue]}
                    />
                  );
                })}

                <b>Higher Education</b>

                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleGradeChange(
                          String(GRADE_TYPE.COLLEGE),
                          e.target.checked
                        )
                      }
                      checked={isChecked(String(GRADE_TYPE.COLLEGE))}
                    />
                  }
                  label={GRADE_TYPE_NAME[GRADE_TYPE.COLLEGE]}
                />
                <b>Adult Education</b>

                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleGradeChange(
                          String(GRADE_TYPE.ADULT_LEARNING),
                          e.target.checked
                        )
                      }
                      checked={isChecked(String(GRADE_TYPE.ADULT_LEARNING))}
                    />
                  }
                  label={GRADE_TYPE_NAME[GRADE_TYPE.ADULT_LEARNING]}
                />
                <b>General</b>

                <FormControlLabel
                  control={
                    <Checkbox
                      onChange={(e) =>
                        handleGradeChange(
                          String(GRADE_TYPE.ALL_AGES),
                          e.target.checked
                        )
                      }
                      checked={isChecked(String(GRADE_TYPE.ALL_AGES))}
                    />
                  }
                  label={GRADE_TYPE_NAME[GRADE_TYPE.ALL_AGES]}
                />
              </FormGroup>
            </div>
            <div className="form_btn">
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpen(false);
                  setSelected([]);
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
