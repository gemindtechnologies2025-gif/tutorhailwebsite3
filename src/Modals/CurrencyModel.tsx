import { Modal, Radio, RadioGroup, TextField } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import CURRENCY from "../constants/Currency";
import { useAppDispatch, useAppSelector } from "../hooks/store";
import { selectCurrentCurrency, setCurrencyMode, setCurrencySymbol, setCurrentCurrency } from "../reducers/currencySlice";

interface GradesProps {
    open: boolean;
    onClose: () => void;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

export default function CurrencyModal({
    open,
    onClose,
    setOpen,
}: GradesProps) {
    const currencyRed = useAppSelector(selectCurrentCurrency);
    const [selectedCurrency, setSelectedCurrency] = useState<any>(CURRENCY[0]);
    const [searchTerm, setSearchTerm] = useState("");

    const dispatch = useAppDispatch();
    const handleChange = (val: any) => {
        setSelectedCurrency(val);
        dispatch(setCurrentCurrency(val?.currency));
        dispatch(setCurrencyMode(val?.code));
        dispatch(setCurrencySymbol(val?.symbol));
        localStorage.setItem("currency", JSON.stringify(val));
        window.location.reload()

    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        setSelectedCurrency(CURRENCY.find((c) => c.currency === currencyRed))
    }, [currencyRed])
    const filteredCurrencies = useMemo(() => {
        if (!searchTerm) return CURRENCY;

        return CURRENCY.filter(currency =>
            currency.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currency.currency.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            currency.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);


    return (
        <Modal
            className="modal setup_modal"
            id="gradesModal"
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            open={open}
            onClose={onClose}
        >
            <div className="modal-dialog">
                <div className="modal-body scroll">
                    <div className="btn-close">
                        <CloseIcon onClick={() => setOpen(false)} />
                    </div>
                    <h2>Select Currency</h2>
                    <div className="search-bar" style={{ marginBottom: '20px' }}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Search currencies..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '8px',
                                }
                            }}
                        />
                    </div>
                    <form className="form">
                        <div className="control_group">
                            <RadioGroup
                                value={selectedCurrency?.currency}   // use currency for comparison
                                onChange={(_, value) => {
                                    const obj = CURRENCY.find((o) => o.currency === value);
                                    if (obj) handleChange(obj);
                                }}
                            >
                                {filteredCurrencies.length > 0 ? (
                                    filteredCurrencies.map((option) => (
                                        <FormControlLabel
                                            key={option.id}
                                            value={option.currency}
                                            control={<Radio />}
                                            label={`${option.title} (${option.symbol})`}
                                        />
                                    ))
                                ) : (
                                    <div style={{ padding: '10px', textAlign: 'center', color: '#666' }}>
                                        No currencies found matching "{searchTerm}"
                                    </div>
                                )}
                            </RadioGroup>
                        </div>
                        <div className="form_btn">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onClick={() => {
                                    setOpen(false);
                                }}
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
}
