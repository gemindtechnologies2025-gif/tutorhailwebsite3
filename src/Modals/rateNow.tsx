import { Modal, TextField, Rating, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import React from "react";
import StarIcon from '@mui/icons-material/Star';
import { usePostReviewsMutation } from "../service/parentDashboard";
import { showError, showToast } from "../constants/toast";

interface RateNowProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
    tutorId: string;
}

export default function RateNowModal({
    open,
    onClose,
    setOpen,
    id,
    tutorId
}: RateNowProps) {

    const [value, setValue] = React.useState<number | null>(4);
    const [postRate] = usePostReviewsMutation();
    const [rating, setRating] = useState<number | null>(null);
    const [review, setReview] = useState<string>("");
    const [ratingType, setRatingType] = useState<any>();

    const postRating = async () => {
        let body = {
            bookingId: id || '',
            tutorId: tutorId || '',
            rating: rating,
            review: review,
            ratingType: ratingType,
        };

        try {
            const res = await postRate(body).unwrap();
            if (res?.statusCode === 200) {
                showToast("Your review is added successfully")
                setOpen(false)
            }

        } catch (error: any) {
            showError(error?.data?.message)
        }
    }

    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRatingType(event.target.value);
    };

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
                        <CloseIcon onClick={() => setOpen(false)} />
                    </div>
                    <h2>Rate your experience with Catherine</h2>
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
                        <div className="control_group">
                            <label>What did you like the best?</label>
                            <RadioGroup
                                aria-labelledby="demo-radio-buttons-group-label"
                                defaultValue="experience"
                                name="radio-buttons-group"
                                className="checkbox_label"
                                value={ratingType}
                                onChange={handleRatingChange}
                            >
                                <FormControlLabel value="1" control={<Radio />} label="Punctuality" />
                                <FormControlLabel value="2" control={<Radio />} label="Helpfulness" />
                                <FormControlLabel value="3" control={<Radio />} label="Clarity" />
                            </RadioGroup>
                        </div>
                        <div className="control_group">
                            <TextField
                                fullWidth
                                hiddenLabel
                                placeholder="Enter your experience"
                                minRows="5.5"
                                multiline
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                            >
                            </TextField>
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