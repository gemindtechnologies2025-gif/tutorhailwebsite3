import { Modal, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

type Conversion = { name: string };

interface GradesProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    setSelected: Dispatch<SetStateAction<string[]>>;
    selected: string[];
    listing: any[];
    search: string;
    setSearch: any;
}

export default function SubjectsModal({
    open,
    onClose,
    setOpen,
    setSelected,
    selected,
    listing,
    search,
    setSearch
}: GradesProps) {



    const handleGradeChange = (value: string, checked: boolean) => {
        if (checked) {
            setSelected((prev) => {
                return Array.isArray(prev) ? [...prev, value] : [value]
            })
        } else {
            setSelected((prev) => {
                return Array.isArray(prev) ? prev.filter(item => item !== value) : [];
            });
        }
    };

    const isChecked = (value: string) => {
        return selected?.some(item => item === value);
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
                    <h2>Select Subjects You Teach</h2>
                    <form className="form">
                        <div className="addMore" style={{marginBottom:"20px"}}>
                            <TextField
                                hiddenLabel
                                fullWidth
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="control_group">
                            <FormGroup className="checkbox_label">
                                {listing?.map(option => (
                                    <FormControlLabel
                                        key={option?._id}
                                        control={
                                            <Checkbox
                                                onChange={(e) => handleGradeChange(option?._id, e.target.checked)}
                                                checked={isChecked(option?._id)}
                                            />
                                        }
                                        label={option?.name}
                                    />
                                ))}
                            </FormGroup>
                        </div>
                        <div className="form_btn">
                            <Button variant="outlined" color="primary" onClick={() => { setOpen(false); setSelected([]) }}>Cancel</Button>
                            <Button color="primary" onClick={() => setOpen(false)}>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}