import { FormControlLabel, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import { useAcceptCoTutorClassMutation } from "../service/class";
import { showError, showToast } from "../constants/toast";

interface WithdrawProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    data: any;
}

export default function BookingAlertModal({
    open,
    onClose,
    setOpen,
    data

}: WithdrawProps) {

    const [bookingApi]=useAcceptCoTutorClassMutation();
    const handleAccept=async(status:number)=>{
        const body={classId:data?.classId,status}
        
        try{    
            const res:any=await bookingApi(body).unwrap();
            if(res?.statusCode===200){
                showToast(`Class ${status==2 ? 'Accepted':"Rejected"} successfully`);
                setOpen(false);
            }
        }catch(error:any){
            showError(error?.data?.message || error?.error || "Something went wrong" );
            
        }
    }


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
                        <h2>{`${data?.tutorName ||"A tutor"} chosed you as a co-tutor in ${data?.className || 'this'} class. Do you want to accept or
          reject?` }</h2>
                        
                        <div className="form_btn">
                            <Button style={{
                                borderRadius: "10px",
                                background: "red",
                                color: "white",
                                border: "none"
                            }} variant="outlined" color="primary" onClick={() => handleAccept(3)}>Reject</Button>
                            <Button style={{
                                borderRadius: "10px",
                                background: "#05A633",
                                color: "white",
                                border: "none"
                            }} variant="outlined" color="primary" onClick={() => handleAccept(2)}>Accept</Button>
                        </div>
                    </div>
                </div >
            </Modal >
        </>
    );
}