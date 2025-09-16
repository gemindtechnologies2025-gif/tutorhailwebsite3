import {
    Button,
    Modal,
    TextField,
    IconButton,
    MenuItem,
    Select,
    FormHelperText,
} from "@mui/material";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import { useCreateContentMutation } from "../service/content";
import { showError, showToast } from "../constants/toast";
import { CONTENT_TYPE, POLL_DURATION, POST_TYPE } from "../constants/enums";
import { isValidInput } from "../utils/validations";
import { useNavigate } from "react-router-dom";

interface AddPollProps {
    open: boolean;
    onClose: () => void;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const POLL_DURATIONS = [
    { value: POLL_DURATION.ONE_DAY, label: "1 day" },
    { value: POLL_DURATION.THREE_DAYS, label: "3 days" },
    { value: POLL_DURATION.ONE_WEEK, label: "7 days" },
    { value: POLL_DURATION.TWO_WEEK, label: "2 weeks" },
];

export default function AddPollModal({ open, onClose, setOpen }: AddPollProps) {
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", "", "", ""]);
    const navigate = useNavigate();

    const [duration, setDuration] = useState(POLL_DURATION.ONE_WEEK);
    const [createContent] = useCreateContentMutation();
    const [loading, setLoading] = useState<boolean>(false);

    const AddPollFunc = async () => {
        try {
            const payload = {
                question,
                options: options.filter((o) => o.trim()),
                duration,
                contentType: CONTENT_TYPE.POST,
                uploadType: POST_TYPE.POLL,
            };
            console.log(payload, "payload");
            const res = await createContent(payload).unwrap();
            if (res?.statusCode == 200) {
                setOpen(false);
                setQuestion("");
                setOptions(["", "", "", ""]);
                setDuration(POLL_DURATION.ONE_WEEK);
                showToast('Poll created successfully');
                navigate('/tutor/posts')
            } else {
                showError(res?.message || "Something went wrong");
            }
        } catch (err: any) {
            showError(err?.data?.message || "Something went wrong");
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const updated = [...options];
        updated[index] = value;
        setOptions(updated);
    };

    const handleRemoveOption = (index: number) => {
        if (options.length > 2) {
            const updated = options.filter((_, i) => i !== index);
            setOptions(updated);
        }
    };

    const handleAddOption = () => {
        if (options.length < 4) {
            setOptions([...options, ""]);
        }
    };

    const handleCreatePoll = () => {
        if (!question.trim() || options.filter((o) => o.trim()).length < 2) return;
        AddPollFunc();
    };

    return (
        <Modal
            className="modal selectDate_modal"
            id="AddPollModal"
            open={open}
            onClose={onClose}
        >
            <div className="modal-dialog">
                <div className="modal-body">
                    <div className="btn-close">
                        <CloseIcon onClick={() => {
                            setOpen(false)
                            setQuestion("");
                            setOptions(["", "", "", ""]);
                            setDuration(POLL_DURATION.ONE_WEEK);
                        }} />
                    </div>
                    <div className="abt_profile_sc social_mdl add_poll">
                        <div className="title_md">
                            <h2>Add Poll</h2>
                        </div>

                        <div className="form_group">
                            <label>Question</label>
                            <TextField
                                fullWidth
                                multiline
                                placeholder="What would you like to ask?"
                                value={question}
                                onChange={(e) => {
                                    if (isValidInput(e.target.value))
                                        setQuestion(e.target.value);
                                }}
                            />
                        </div>

                        <div className="form_group">
                            <label style={{ paddingTop:"20px" }}>Options</label>
                            <div className="option_main">

                            {options.map((opt, index) => (
                                <div key={index} className="option_row">
                                    <TextField
                                        fullWidth
                                        placeholder={`Option ${index + 1}`}
                                        value={opt}
                                        onChange={(e) => {
                                            if (isValidInput(e.target.value))
                                                handleOptionChange(index, e.target.value);
                                        }}
                                    />
                                    {options.length > 2 && (
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveOption(index)}
                                            style={{ marginLeft: "8px", color: "green" }}
                                        >
                                            Remove
                                        </IconButton>
                                    )}
                                </div>
                            ))}
                            </div>

                            {/* Add Option button (only if less than 4) */}
                            {options.length < 4 && (
                                <Button
                                    variant="text"
                                    color="primary"
                                    onClick={handleAddOption}
                                    
                                >
                                    + Add Option
                                </Button>
                            )}

                            {options.filter((o) => o.trim()).length < 2 && (
                                <FormHelperText error>
                                    At least 2 options are required
                                </FormHelperText>
                            )}
                        </div>

                        <div className="form_group">
                            <label>Poll Duration</label>
                            <Select
                                fullWidth
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            >
                                {POLL_DURATIONS.map((d) => (
                                    <MenuItem key={d.value} value={d.value}>
                                        {d?.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </div>

                        <div className="btn_grp" style={{ marginTop: "16px" }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                disabled={
                                    !question.trim() ||
                                    options.filter((o) => o.trim()).length < 2
                                }
                                onClick={handleCreatePoll}
                            >
                                Create Poll
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
