import React from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import useAuth from '../hooks/useAuth';
import moment from 'moment';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector } from '../hooks/store';
import { currencyMode, currencySymbol, selectCurrencyRates, selectCurrentCurrency } from "../reducers/currencySlice";
import { convertCurrency } from '../utils/currency';




export const CheckoutSummary = ({ classFee, serviceFeeName, serviceFee, transportationFee, total, isLoading, submit, isPromo, discount, hours }: any) => {
    const user = useAuth();
    const currencyRates = useAppSelector(selectCurrencyRates);
    const currentCurrency = useAppSelector(selectCurrentCurrency);
    const currentCurrencyMode = useAppSelector(currencyMode);
    const currentCurrencySymbol = useAppSelector(currencySymbol);
    return (
        <>
            <div className="card_mn summary_mn">
                <div className="title_sb">
                    <h2>Checkout Summary</h2>
                </div>
                <div className="mn_lyout">
                    <div className="table_layout">
                        <div className="sub_hd">
                            <h3>Contact Details</h3>
                        </div>
                        <div className='table_responsive'>
                            <table >
                                <tr>
                                    <td >Full Name</td>
                                    <td>{user?.name || ""}</td>
                                </tr>
                            </table>
                        </div>

                    </div>
                    {isPromo ? (
                        <div className='Promo'>
                            <div className="sub_hd">
                                <h3>Promo Code</h3>
                            </div>

                            <p>Coupon Applied <span>  </span>- `${currentCurrencySymbol} ${convertCurrency({
                                price: discount
                                    ? discount : 0,
                                rate: currencyRates[currentCurrency],
                            }).toLocaleString(`${currentCurrencyMode}`)}` </p>
                        </div>
                    ) : null}


                    <div className='Promo pay_dtl'>
                        <div className="sub_hd">
                        </div>
                        <div className='totl'>
                            <h3>Payment Details</h3>
                            <p>Class fee
                                <span>{classFee ? `${currentCurrencySymbol} ${convertCurrency({
                                price: classFee
                                    ? classFee : 0,
                                rate: currencyRates[currentCurrency],
                            }).toLocaleString(`${currentCurrencyMode}`)}` : "00"}  </span></p>
                            {hours > 1 ? (
                                <p>Hours
                                    <span>{hours}  </span></p>
                            ) : null}

                            <p>Service fee ( {serviceFeeName || ""}) <span>{serviceFee ? ` ${serviceFee}`:"00" } </span></p>
                            <p>Transportation fee<span>{(transportationFee &&
                                (transportationFee > 0.01
                                    ? `$${transportationFee.toFixed(2)}`
                                    : `$${transportationFee.toFixed(5)}`)) ||
                                "-"} </span></p>

                            <p>Total Charges<span>{total ? `${currentCurrencySymbol} ${convertCurrency({
                                price: total
                                    ? total : 0,
                                rate: currencyRates[currentCurrency],
                            }).toLocaleString(`${currentCurrencyMode}`)}` : "00"}  </span></p>
                        </div>

                        <button onClick={() => submit()} className='btn primary'>
                            {isLoading ? (
                                <Box display="flex" gap={2} alignItems="center">
                                    <CircularProgress color="inherit" size={20} />
                                    &nbsp;Loading
                                </Box>
                            ) : (
                                "Pay Now"
                            )}
                        </button>
                    </div>


                </div>
            </div>
        </>
    )
}


export default CheckoutSummary;