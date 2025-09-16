import { FormControlLabel, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";

interface WithdrawProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    msg: string;
}

export default function LoginAlertModal({
    open,
    onClose,
    setOpen,
    msg

}: WithdrawProps) {

    const navigate = useNavigate();


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
                        <h2>{msg}</h2>
                        <div style={{display:'flex',justifyContent:'center'}}>
                            <img style={{maxHeight:'200px'}} src='/static/images/loginAlert.png' alt='error'/>
                        </div>
                        <div className="form_btn">
                            <Button style={{
                                borderRadius: "10px",
                                border: "none"
                            }} variant="outlined" color="primary" onClick={() => setOpen(false)}>Close</Button>
                            <Button style={{
                                borderRadius: "10px",
                                background: "#05A633",
                                color: "white",
                                border: "none"
                            }} variant="outlined" color="primary" onClick={() => navigate("/auth/as-parent/login")}>Login</Button>
                        </div>
                    </div>
                </div >
            </Modal >
        </>
    );
}