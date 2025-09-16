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
import { DURATION_TYPE, Engagements, REPORT } from "../constants/enums";
import {
    useEngagementMutation,
    useReportContentMutation,
    useUpdateContentMutation,
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

export default function MuteForumModal({
    open,
    onClose,
    setOpen,
    data,
}: SelectDateProps) {
   

    const [updateEngagement, { isLoading }] = useEngagementMutation();
    const handleHide = async () => {
        try {
            let body = {
                contentId: data?._id || "",
                engagementType:Engagements.DONT_SHOW_CONTENT
            };

            const res = await updateEngagement( body ).unwrap();
            if (res?.statusCode === 200) {
                setOpen(false);
                showToast("Submitted Successfully")
               
            }
        } catch (error: any) {
            showError(error?.data?.message);
        }
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
                            }}
                        />
                    </div>
                    <div className="abt_profile_sc ">
                        <div className="title_md">
                            <h2>Mute User ? </h2>                            
                                <p>
                                    You Won't see any more discussions from {`${data?.user?.name||"Unknown user"}`} in your feed. you can undo this action by visiting their profile directly.
                                </p>
                              
                                <div className="btn_modal">
                                    <button
                                        onClick={() => setOpen(false)}
                                        type="button"
                                        className="btn "
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => handleHide()}
                                        type="button"
                                        className="btn primary"
                                    >
                                        Hide Posts
                                    </button>
                                </div>

                         
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
