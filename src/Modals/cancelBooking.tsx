import { Modal, TextField, Select, SelectChangeEvent, MenuItem } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import React from "react";
import { useUpdateBookingMutation } from "../service/tutorApi";
import { showError, showToast } from "../constants/toast";

interface CancelBookingProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
    fetchBookings: () => void;
    status: number | null;
}

export default function CancelBookingModal({
    open,
    onClose,
    setOpen,
    id,
    fetchBookings,
    status
}: CancelBookingProps) {
    const [reason, setReason] = useState<string>("");
    const [updateBookingApi] = useUpdateBookingMutation();

    const fetchReject = async () => {
        const body = {
            bookingStatus: status,
            cancelReason: reason,
        }
        try {
            const res = await updateBookingApi({ body: body, bookingId: id }).unwrap();
            if (res?.statusCode === 200) {
                showToast(status===4 ? "Booking rejected successfully":"Booking cancelled successfully");
                setOpen(false)
                fetchBookings()
            }
        } catch (error: any) {
            showError(error?.data?.message)
        }
    }






    return (
        <Modal
            className="modal cancel_modal"
            id="cancelBookingModal"
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
                    <h2>Select reason for {status===4 ? "rejection":"cancellation"}</h2>
                    <p>We use your feedback to better improve the quality of service you receive from the website</p>
                    <form className="form">
                        <div className="control_group">
                            <TextField
                                fullWidth
                                hiddenLabel
                                placeholder={status===4 ? "Enter reason for rejection":"Enter reason for cancellation"}
                                minRows="5"
                                multiline
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >

                            </TextField>
                        </div>
                        <div className="form_btn">
                            <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button color="primary" disabled={reason?.length === 0} onClick={fetchReject}>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}