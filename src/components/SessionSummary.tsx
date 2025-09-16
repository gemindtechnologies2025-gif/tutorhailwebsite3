import React, { useState } from 'react'
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import useAuth from '../hooks/useAuth';
import moment from 'moment';
import { useGetPromoCodeParentQuery } from '../service/promoCode';
import { useParams } from 'react-router-dom';
import { DISCOUNT_TYPE } from '../constants/enums';
import CloseIcon from "@mui/icons-material/Close";
import { currencyMode, currencySymbol, selectCurrencyRates, selectCurrentCurrency } from "../reducers/currencySlice";
import { useAppSelector } from '../hooks/store';
import { convertCurrency } from '../utils/currency';


export const SessionSummary = ({ selectedDate, time, hours, price, subject, submit, promo, setPromo }: any) => {


    const user = useAuth();
    const { id } = useParams();
    var pricing = price && price();
    console.log(pricing,'pricing');
    
    const currencyRates = useAppSelector(selectCurrencyRates);
    const currentCurrency = useAppSelector(selectCurrentCurrency);
    const currentCurrencyMode = useAppSelector(currencyMode);
    const currentCurrencySymbol = useAppSelector(currencySymbol);


    const { data: promoCode } = useGetPromoCodeParentQuery({
        tutorId: id,
    });
    const [showCoupon, setShowCoupon] = useState<boolean>(false);




    const handleApplyCoupon = (
        type: number,
        discount: number,
        name: string,
        _id: string
    ) => {
        if (type === DISCOUNT_TYPE.PERCENTAGE) {
            let dis = pricing * (discount / 100);
            let grand = pricing - dis;
            setPromo((prev: any) => ({
                ...prev,
                grand: grand,
                code: name,
                discount: dis,
                _id: _id,
            }));
        } else {
            let grand = pricing - discount;
            setPromo((prev: any) => ({
                ...prev,
                grand: grand,
                code: name,
                discount: discount,
                _id: _id,
            }));
        }
    };


    return (
        <>
            <div className="card_mn summary_mn">
                <div className="title_sb">
                    <h2>Booking Summary</h2>
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
                        <div className="sub_hd">
                            <h3>Booking Detail</h3>
                        </div>
                        <div className='table_responsive lst'>
                            <table >
                                <tr>
                                    <td >Date</td>
                                    <td> {selectedDate?.map((item: any, index: number) => (
                                        <p key={index}>
                                            {item}
                                        </p>
                                    ))}</td>
                                </tr>
                                {time?.start ? (
                                    <tr>
                                        <td >Time</td>
                                        <td> {`${moment(time?.start).format(
                                            "hh:mm A"
                                        )} - ${moment(time?.end).format("hh:mm A")}`}</td>
                                    </tr>
                                ) : null}

                                <tr>
                                    <td >Hours</td>
                                    <td>{hours}</td>
                                </tr>
                                <tr>
                                    <td >Subject</td>
                                    <td>{subject}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    {pricing !== '0.00' ? (
                        <div className='Promo'>
                            <div className="sub_hd">
                                <h3>Promo Code</h3>
                            </div>

                            <p onClick={() => setShowCoupon(true)} > {promo?.code ? promo?.code : "Apply Coupon"}                         <span
                                onClick={() => {
                                    promo?.code
                                        ? setPromo({
                                            code: "",
                                            _id: "",
                                            discount: 0,
                                            grand: 0,
                                        })
                                        : setShowCoupon(true);
                                }}
                            >
                                {promo?.code ? <CloseIcon /> : <KeyboardArrowRightIcon />}
                            </span></p>
                        </div>
                    ) : null}

                    {showCoupon ? (
                        <div className='Promo'>
                            <div className="sub_hd">
                                <h3>Available Coupons</h3>
                            </div>
                            <ul className="coupon_code_list">
                                {promoCode?.data?.data?.length
                                    ? promoCode?.data?.data?.map(
                                        (item: any, index: number) => {
                                            return (
                                                <li key={item?._id}>
                                                    <div className="code_div">
                                                        <p>{item?.codeName || ""} </p>

                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                handleApplyCoupon(
                                                                    item?.discountType,
                                                                    item?.discount,
                                                                    item?.codeName,
                                                                    item?._id
                                                                );
                                                            }}
                                                            className="btn primary"
                                                            style={
                                                                item?.discountType ===
                                                                    DISCOUNT_TYPE.FLAT &&
                                                                    item?.discount >
                                                                    pricing
                                                                    ? { backgroundColor: "gray" }
                                                                    : {}
                                                            }
                                                            disabled={
                                                                item?.discountType ===
                                                                DISCOUNT_TYPE.FLAT &&
                                                                item?.discount >
                                                                pricing
                                                            }
                                                        >
                                                            {promo?.code == item?.codeName
                                                                ? "Applied"
                                                                : "Apply"}
                                                        </button>
                                                    </div>
                                                    <hr />
                                                    <p>
                                                        {`Use code ${item?.codeName || ""} to get ${item?.discount
                                                            }${item?.discountType === 1 ? "" : "%"
                                                            } off your tutoring session. Offer valid until ${item?.expiryDate
                                                                ? moment(item?.expiryDate).format(
                                                                    "LL"
                                                                )
                                                                : ""
                                                            }.`}
                                                    </p>
                                                </li>
                                            );
                                        }
                                    )
                                    : "No Promo code available"}
                            </ul>
                        </div>
                    ) : null}


                    <div className='Promo pay_dtl'>

                        <div className='totl'>
                            <h3>Payment Details</h3>

                            <p>Total Price <span>  {`${currentCurrencySymbol} ${convertCurrency({
                                price: pricing
                                    ? pricing : 0,
                                rate: currencyRates[currentCurrency],
                            }).toLocaleString(`${currentCurrencyMode}`)}`
                            } /hour </span></p>
                            {promo?.discount ? (
                                <p>Discount <span>{promo?.discount ? `${currentCurrencySymbol} ${convertCurrency({
                                    price: promo?.discount
                                        ? promo?.discount : 0,
                                    rate: currencyRates[currentCurrency],
                                }).toLocaleString(`${currentCurrencyMode}`)}` : "00"}  </span></p>

                            ) : null}
                            {promo?.grand ? (

                                <p>Grand Total <span>  {`${currentCurrencySymbol} ${convertCurrency({
                                    price: promo?.grand
                                        ? promo?.grand : 0,
                                    rate: currencyRates[currentCurrency],
                                }).toLocaleString(`${currentCurrencyMode}`)}`
                                } /hour </span></p>
                            ) : null}
                        </div>

                        <button onClick={() => submit()} className='btn primary'>Proceed to Pay</button>
                    </div>


                </div>
            </div>
        </>
    )
}


export default SessionSummary;