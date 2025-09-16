import { Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

interface EducationLevelProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSelected: Dispatch<SetStateAction<number[]>>;
    selected: number[];
}

export default function EducationLevelModal({
    open,
    onClose,
    setOpen,
    setSelected,
    selected
}: EducationLevelProps) {

    const handleEducationLevelChange = (value: number, checked: boolean) => {
        if (checked) {
            setSelected((prev) => {
                return Array.isArray(prev) ? [...prev, value] : [value];
            });
        } else {
            setSelected((prev) => {
                return Array.isArray(prev) ? prev.filter(item => item !== value) : [];
            });
        }
    };

    return (
        <Modal
            className="modal setup_modal"
            id="educationLevelModal"
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
                    <h2>Select Education Level</h2>
                    <form className="form">
                        <div className="control_group">
                            <FormGroup className="checkbox_label">
                                {[1, 2, 3, 4, 5].map(value => (
                                    <FormControlLabel
                                        key={value}
                                        control={
                                            <Checkbox
                                                onChange={(e) => handleEducationLevelChange(value, e.target.checked)}
                                                checked={selected?.includes(value)}
                                            />
                                        }
                                        label={value === 1 ? "Visual Learning" :
                                            value === 2 ? "Auditory Learning" :
                                                value === 3 ? "Reading and Writing" :
                                                    value === 4 ? "Integrated Approach" :
                                                        "Other"}
                                    />
                                ))}
                            </FormGroup>
                        </div>
                        <div className="form_btn">
                            <Button variant="outlined" color="primary" onClick={() => { setOpen(false); setSelected([]) }}>Cancel</Button>
                            <Button color="primary" onClick={() => { setOpen(false); }}>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}