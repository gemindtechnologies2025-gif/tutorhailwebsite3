import { Modal, TextField, Rating, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import React from "react";
import StarIcon from '@mui/icons-material/Star';
import { usePostReviewsMutation } from "../service/parentDashboard";
import { showError, showToast } from "../constants/toast";
import { PROMOCODE_TYPE_CLASS } from "../constants/enums";

interface RateNowProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
     classId:string;
    tutorId:string;
}

export default function RateClassModal({
    open,
    onClose,
    setOpen,
    id,
    classId,
    tutorId
}: RateNowProps) {

    const [postRate] = usePostReviewsMutation();
    const [rating, setRating] = useState<number | null>(null);


    const postRating = async () => {
        let body = {
            bookingId: id || '',

            type: PROMOCODE_TYPE_CLASS.CLASS,
            classId: classId || '',
            rating: rating,
            tutorId: tutorId || '',

        };

        try {
            const res = await postRate(body).unwrap();
            if (res?.statusCode === 200) {
                showToast("Rating added successfully")
                setOpen(false);
                setRating(null)
            }

        } catch (error: any) {
            showError(error?.data?.message)
        }
    }



    return (
        <Modal
            className="modal rate_modal"
            id="rateNowModal"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onClose={onClose}
        >
            <div className="modal-dialog">
                <div className="modal-body">
                    <div className="btn-close">
                        <CloseIcon onClick={() => {setOpen(false);setRating(null)}} />
                    </div>
                    <h2>Rate your experience</h2>
                    <form className="form">
                        <div className="control_group text_center">
                            <Rating
                                name="rating"
                                value={rating}
                                emptyIcon={<StarIcon />}
                                onChange={(event, newValue) => {
                                    setRating(newValue);
                                }}
                            />
                        </div>

                        <div className="form_btn">
                            <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button color="primary" onClick={() => postRating()}>Submit</Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}