import { Modal } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

interface PaymentSuccessfulProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function PaymentSuccessfulModal({
    open,
    onClose,
    setOpen,
}: PaymentSuccessfulProps) {

    const navigate = useNavigate();

    return (
        <Modal
            className="modal success_modal"
            id="paymentSuccessfulModal"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onClose={(event, reason) => {
                if (reason !== "backdropClick") {
                  onClose();
                }
              }}
        >
            <div className="modal-dialog">
                <div className="modal-body">
                    <figure><img src={`/static/images/success_icon.svg`} alt="Icon" /></figure>
                    <h2>Payment Successful</h2>
                    <p>Thank you for your purchase. We value our learners
                    Keep Learning!!</p>
                    <Button color="primary" onClick={() => navigate('/parent/booking-detail/pending')}>View Details</Button>
                </div>
            </div>
        </Modal>
    );
}