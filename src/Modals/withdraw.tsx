import { FormControlLabel, Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import { usePostTutorWithdrawMutation } from "../service/tutorApi";
import { showError, showToast, showWarning } from "../constants/toast";
import Loader from "../constants/Loader";
import useAuth from "../hooks/useAuth";
import { useLazyGetBankQuery } from "../service/tutorProfileSetup";
import { isNumber } from "../utils/validations";

interface WithdrawProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
    earnings: number;
}

export default function WithdrawModal({
    open,
    onClose,
    setOpen,
    earnings
}: WithdrawProps) {

    const [amount, setAmount] = useState<string>("");
    const [type, setType] = useState<string>("1");
    const [withdrawApi] = usePostTutorWithdrawMutation();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const userDetails = useAuth();
    const [getBank] = useLazyGetBankQuery();
    const [bankData, setBankData] = useState<any>();

    const handleRadioChange = (event: any) => {
        setType(event.target.value);
    };

    const fetchWithdraw = async () => {
        let body = {
            withdraw: Number(amount),
            withdrawMode: type,
        }

        if (earnings < Number(amount)) {
            showWarning("Withdraw amount should be less than earnings");
            return;
        }

        try {
            setIsLoading(true)
            const res = await withdrawApi({ body: body }).unwrap();
            setIsLoading(false)
            if (res?.statusCode === 200) {
                setOpen(false)
                showToast("Withraw request sent successfully");
                setAmount('')
            }
        } catch (error: any) {
            setIsLoading(false)
            showError(error?.data?.message);
            setAmount('')
            setOpen(false)
        }
    }

    const fetchBank = async () => {
        try {
            const res = await getBank({}).unwrap();
            if (res?.statusCode === 200) {
                setBankData(res?.data?.bank[0]);
            }
        } catch (error: any) {
            showError(error?.message)
        }
    }

    useEffect(() => {
        fetchBank();
    }, [])




    return (
        <>
            <Loader isLoad={isLoading} />
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
                        <h2>Withdraw Amount</h2>
                        <p>Withdraw the amount to your bank account</p>
                        <div className="amount_box">
                            <div className="control_group">
                                <TextField
                                    hiddenLabel
                                    fullWidth
                                    placeholder="Enter Amount"
                                    inputProps={{
                                        maxLength: 20,
                                    }}
                                    value={amount}

                                    onChange={(e) => {
                                        if (
                                            e.target.value === " "
                                        ) {
                                        } else if (isNumber(e.target.value)) {
                                            setAmount(e.target.value)
                                        }
                                    }}
                                ></TextField>
                            </div>
                        </div>
                        <form className="form">
                            <div className="control_group">
                                <label>Choose Account</label>
                                <RadioGroup
                                    className="checkbox_label"
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    name="radio-buttons-group"
                                    value={type}
                                    onChange={handleRadioChange}
                                >
                                    <FormControlLabel
                                        value="1"
                                        control={<Radio />}
                                        label={<><p><cite><strong>Bank Detail</strong><span>{userDetails?.name || "-"}{" "}</span><span>{bankData?.bankName || "-"}</span><span>{bankData?.accountNumber || "-"}</span></cite></p></>}
                                    />
                                    <FormControlLabel
                                        value="2"
                                        control={<Radio />}
                                        label={<><p> <cite><strong>Mobile Money</strong><span>{userDetails?.dialCode + userDetails?.phoneNo || "-"}</span></cite></p></>}
                                    />
                                </RadioGroup>
                            </div>
                            <div className="form_btn">
                                <Button variant="outlined" color="primary" onClick={() => setOpen(false)}>Cancel</Button>
                                <Button color="primary"
                                    disabled={amount == null}
                                    onClick={() => fetchWithdraw()}>Withdraw</Button>
                            </div>
                        </form>
                    </div>
                </div >
            </Modal >
        </>
    );
}