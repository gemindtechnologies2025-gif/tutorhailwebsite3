import { FormControlLabel, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import { showError, showToast, showWarning } from "../constants/toast";

import { removeFromStorage } from "../constants/storage";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { resetAuth } from "../reducers/authSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../hooks/store";
import secureLocalStorage from "react-secure-storage";

interface WithdrawProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;

}

export default function LogoutModal({
    open,
    onClose,
    setOpen,

}: WithdrawProps) {

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        secureLocalStorage.clear(); 
        removeFromStorage(STORAGE_KEYS.token);
        removeFromStorage(STORAGE_KEYS.user);
        dispatch(resetAuth());
        showToast("Logged out successfully")
        navigate("/", { replace: true });
    };



    return (
        <>
            <Modal
                className="modal withdraw_modal"
                id="withdrawModal"
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
                        <h2>Are you sure you want to logout ?</h2>
                        <div className="form_btn">
                            <Button style={{
                                borderRadius: "10px",
                                border: "none"
                            }} variant="outlined" color="primary" onClick={() => setOpen(false)}>No</Button>
                            <Button style={{

                                borderRadius: "10px",
                                background: "#05A633",
                                color: "white",
                                border: "none"
                            }} variant="outlined" color="primary" onClick={() => handleLogout()}>Yes</Button>
                        </div>
                    </div>
                </div >
            </Modal >
        </>
    );
}