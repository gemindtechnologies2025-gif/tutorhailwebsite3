/* eslint-disable jsx-a11y/img-redundant-alt */
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { ParentLayout } from "../../../layout/parentLayout";
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import PaymentSuccessfulModal from "../../../Modals/paymentSuccessful";
import { useState } from "react";

export default function ParentPayment() {

    const navigate = useNavigate();

    const [open1, setOpen1] = useState(false);
    const handleCloseModal1 = () => {
        setOpen1(false);
    };

    return (
        <>
            <ParentLayout className="role-layout">
                <main className="content">
                    <section className="uhb_spc pPayment_sc">
                        <div className="conta_iner v2">
                            <div className="role_head">
                                <button className="back_arrow" onClick={() => navigate('/parent/tutor-detail')}>
                                    <img src={`/static/images/back.png`} alt="Back" />
                                </button>
                                <h1 className="hd_3">Payment</h1>
                            </div>
                            <div className="role_body">
                                <form className="form payment_form gap_m">
                                    <div className="whiteBox">
                                        <h2>Saved Cards</h2>
                                        <div className="control_group">
                                            <RadioGroup
                                                className="checkbox_label"
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group"
                                            >
                                                <FormControlLabel
                                                    value="card1"
                                                    control={<Radio />}
                                                    label={
                                                        <>
                                                            <figure className="card_icon"><img src={`/static/images/card_icon.png`} alt="Icon" /></figure>
                                                            <span className="addCard"><AddIcon /> Add new Card</span>
                                                        </>}
                                                />
                                                <FormControlLabel
                                                    value="card2"
                                                    control={<Radio />}
                                                    label={<><p><figure><img src={`/static/images/upi_icon.png`} alt="Icon" /></figure> <span>Pay via UPI</span></p></>}
                                                />
                                                <FormControlLabel
                                                    value="card3"
                                                    control={<Radio />}
                                                    label={<><p><figure><img src={`/static/images/upi_icon.png`} alt="Icon" /></figure> <span>Pay via Net Banking</span></p></>}
                                                />
                                            </RadioGroup>
                                        </div>
                                        <div className="form_btn">
                                            <Button variant="outlined" color="primary">Cancel</Button>
                                            <Button onClick={() => setOpen1(true)}>Pay Now</Button>
                                        </div>
                                    </div>
                                    <div className="whiteBox">
                                        <h2>Payment Breakdown</h2>
                                        <ul>
                                            <li><span>Class Fee</span><span>$100.00</span></li>
                                            <li><span>Service Fees (20%)</span><span>$20.00</span></li>
                                            <li><span>Transport Fees</span><span>$20.00</span></li>
                                            <li><hr /></li>
                                            <li><strong>Grand Total</strong><strong className="c_primary">$60.00</strong></li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </main>
            </ParentLayout>

            <PaymentSuccessfulModal
                open={open1}
                onClose={handleCloseModal1}
                setOpen={setOpen1}
            />
        </>
    );
}
