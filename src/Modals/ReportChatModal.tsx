import {
    Button,
    CircularProgress,
    MenuItem,
    Modal,
    Select,
    TextareaAutosize,
    TextField,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
} from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";

import "react-day-picker/style.css";
import { isValidInput } from "../utils/validations";
import { CHAT_REPORT, REPORT_CHAT } from "../constants/enums";
import {
    useReportContentMutation,
} from "../service/content";
import { showError, showToast, showWarning } from "../constants/toast";
import { useReportChatMutation } from "../service/chatApi";

interface SelectDateProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    chatId: string;
    tutorId?: string;
    parentId?:string;
}

type FormData = {
    report: string;
    note: string;
};

const prettifyEnumKey = (key: string) => {
    if (key === "SCAM_FRAUD") return "Scam or fraud"; // special case
    return key
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};

export default function ReportChatModal({
    open,
    onClose,
    setOpen,
    chatId,
    tutorId,
    parentId
}: SelectDateProps) {
    const [formData, setFormData] = useState<FormData>({
        report: "",
        note: "",
    });
    const [reportUser, { isLoading }] = useReportChatMutation();


    const ReportUser = async () => {
        if (!formData.report) {
            showWarning("Please select reason");
            return;
        }
        const body = {
            type: CHAT_REPORT.REPORT,
            chatId: chatId,
            ...(tutorId ? { tutorId: tutorId}:{}),
             ...(parentId ? { parentId: parentId}:{}),
            ...(formData?.note ? { details: formData?.note } : {}),
            report: Number(formData.report)
        }
        
        try {
            const res = await reportUser(body).unwrap();
            if (res?.statusCode == 200) {
                showToast("Report Submitted Successfully");
                setOpen(false)
            }
        } catch (error: any) {
            showError(error?.data?.message || "Something went wrong")
        }
    }

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
    };

    return (
        <Modal
            className="modal selectDate_modal"
            id="GiftModal"
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
                    <div className="abt_profile_sc ">
                        <div className="title_md">
                            <h2>Report</h2>

                            <form className="form_group" onSubmit={handleSubmit}>
                                <div style={{ width: "100%" }} className="input_group">
                                    <FormControl component="fieldset" style={{ width: "100%" }}>
                                        <RadioGroup
                                            value={formData.report}
                                            onChange={(e) => handleChange("report", e)}
                                        >
                                            {Object.entries(REPORT_CHAT).map(([key, value]) => {
                                                if (typeof value === "number") {
                                                    return (
                                                        <FormControlLabel
                                                            key={value}
                                                            value={value.toString()}
                                                            control={<Radio />}
                                                            label={prettifyEnumKey(key)}
                                                        />
                                                    );
                                                }
                                                return null;
                                            })}
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                <div style={{ width: "100%" }} className="input_group">
                                    <TextareaAutosize
                                        minRows={4}
                                        style={{ width: "100%" }}
                                        placeholder="Please provide any additional context..."
                                        value={formData.note}
                                        onChange={(e) => {
                                            if (isValidInput(e.target.value)) handleChange("note", e);
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={ReportUser}
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
            </div>
        </Modal>
    );
}
