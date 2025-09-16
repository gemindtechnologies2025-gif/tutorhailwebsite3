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

export default function DontShowPostModal({
    open,
    onClose,
    setOpen,
    data,
}: SelectDateProps) {
   

    const [updateEngagement, { isLoading }] = useEngagementMutation();
    const handleHide = async ({type,duration}:any) => {
        try {
            let body = {
                contentId: data?._id || "",
                duration:duration,
                durationType:type,
                engagementType:Engagements.MUTE
            };

            const res = await updateEngagement( body ).unwrap();
            if (res?.statusCode === 200) {
                setOpen(false);
                showToast("User muted Successfully")
               
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
                                    You Won't see any of their discussions during this time. The mute will automatically expire.
                                </p>
                                <div style={{ width: "100%" }} className="input_group">
                                    <ul>
                                        <li onClick={()=>handleHide({type:DURATION_TYPE.HOURS,duration:1})} className="mute_list">
                                            1 Hour
                                        </li>
                                        <li onClick={()=>handleHide({type:DURATION_TYPE.HOURS,duration:24})} className="mute_list">
                                            24 Hour
                                        </li>
                                        <li onClick={()=>handleHide({type:DURATION_TYPE.DAYS,duration:7})} className="mute_list">
                                            7 Days
                                        </li>
                                        <li onClick={()=>handleHide({type:DURATION_TYPE.DAYS,duration:30})} className="mute_list">
                                            30 Days
                                        </li>
                                    </ul>
                                </div>
                                <div style={{marginTop:'20px'}}>
                                    <button
                                        onClick={() => setOpen(false)}
                                        type="button"
                                        className="btn primary"
                                    >
                                        Cancel
                                    </button>
                                </div>

                         
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
}
