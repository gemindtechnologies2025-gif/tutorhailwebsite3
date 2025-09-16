/* eslint-disable jsx-a11y/img-redundant-alt */
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import { ParentLayout } from "../../../layout/parentLayout";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import PaymentSuccessfulModal from "../../../Modals/paymentSuccessful";
import { useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { convertToInternationalCurrencySystem } from "../../../utils/validations";
import { useGetPromoCodeParentQuery } from "../../../service/promoCode";
import moment from "moment";
import { DISCOUNT_TYPE } from "../../../constants/enums";
import CloseIcon from "@mui/icons-material/Close";
import { useBookClassMutation } from "../../../service/class";
import { showError } from "../../../constants/toast";
import { socket } from "../../../utils/socket";
import { convertCurrency } from "../../../utils/currency";
import { useAppSelector } from "../../../hooks/store";
import { currencyMode, currencySymbol, selectCurrencyRates, selectCurrentCurrency } from "../../../reducers/currencySlice";

type PROMO = {
  code: string;
  _id: string;
  discount: number;
  grand: number;
};

export default function PaymentDetails() {
  const { id } = useParams();
  const [bookClass, { isLoading }] = useBookClassMutation();
  const navigate = useNavigate();
  const currencyRates = useAppSelector(selectCurrencyRates);
  const currentCurrency = useAppSelector(selectCurrentCurrency);
  const currentCurrencyMode = useAppSelector(currencyMode);
  const currentCurrencySymbol = useAppSelector(currencySymbol);


  const { data: promoCode } = useGetPromoCodeParentQuery({
    classId: id,
  });
  let { state } = useLocation();
  const [showCoupon, setShowCoupon] = useState<boolean>(false);
  const [promo, setPromo] = useState<PROMO>({
    code: "",
    _id: "",
    discount: 0,
    grand: 0,
  });

  console.log(promo,'promo');
  


  const BookClassFunc = async () => {
    const body = {
      ...state.body,
      ...(promo?._id ? { promocodeId: promo?._id } : {}),
    };

    try {
      const res = await bookClass({ body: body, isCartScreen: false }).unwrap();

      if (res?.statusCode === 200) {
        //    setOpen1(true)
        window.open(res?.data?.link?.redirect_url, "_self");
      }
    } catch (error: any) {
      showError(error?.data?.message || "something went wrong");
    }
  };

  const [open1, setOpen1] = useState(false);
  const handleCloseModal1 = () => {
    setOpen1(false);
  };

  const handleApplyCoupon = (
    type: number,
    discount: number,
    name: string,
    _id: string
  ) => {
    if (type === DISCOUNT_TYPE.PERCENTAGE) {
      let dis = state?.data?.booking?.grandTotal * (discount / 100);
      let grand = state?.data?.booking?.grandTotal - dis;
      setPromo((prev) => ({
        ...prev,
        grand: grand,
        code: name,
        discount: dis,
        _id: _id,
      }));
    } else {
      let grand = state?.data?.booking?.grandTotal - discount;
      setPromo((prev) => ({
        ...prev,
        grand: grand,
        code: name,
        discount: discount,
        _id: _id,
      }));
    }
  };

  const handlePaymentOk = (res: any) => {
    const paymentStatus =
      res?.data?.paymentDetails?.payment_status_description || "";
    //    console.log(res, "socket");
    if (paymentStatus === "Completed") {
      setOpen1(true);
    } else {
      navigate(`/parent/ClassDetail/${id}`);
    }
  };
  useEffect(() => {
    socket?.on("payment_ok", handlePaymentOk);
    return () => {
      // Clean up the socket listener when the component is unmounted
      socket?.off("payment_ok", handlePaymentOk);
    };
  }, []);

  return (
    <>
      <ParentLayout className="role-layout">
        <main className="content">
          <section className="uhb_spc pPayment_sc ut_spc">
            <div className="conta_iner v2">
              <div className="role_body">
                <form className="form payment_form gap_m">
                  <div className="whiteBox">
                    <h2>Payment Details</h2>
                    <ul>
                      <li>
                        <span>Class Fee</span>
                        <span>
                          {state?.data?.booking?.classPrice
                            ? `${currentCurrencySymbol} ${convertCurrency({
                              price: state?.data?.booking?.classPrice
                                ? state?.data?.booking?.classPrice : 0,
                              rate: currencyRates[currentCurrency],
                            }).toLocaleString(`${currentCurrencyMode}`)}`
                            : ""}{" "}
                        </span>
                      </li>
                      <li>
                        <span>Service Fees (%)</span>
                        <span>
                          {state?.data?.setting?.serviceFees
                            ? state?.data?.setting?.serviceFees + "%"
                            : ""}
                        </span>
                      </li>
                      {promo?.discount ? (
                        <li>
                          <span>Promo Discount</span>
                          <span>
                            {promo?.discount
                              ? `${currentCurrencySymbol} ${convertCurrency({
                                price: promo?.discount
                                  ? promo?.discount : 0,
                                rate: currencyRates[currentCurrency],
                              }).toLocaleString(`${currentCurrencyMode}`)}`
                              : ""}
                          </span>
                        </li>
                      ) : null}

                      <li>
                        <hr />
                      </li>
                      <li>
                        <strong>Grand Total</strong>
                        <strong className="c_primary">
                          {promo?._id 
                            ? `$${promo?.grand?.toFixed(2) || 0}`
                            : state?.data?.booking?.grandTotal
                              ? `$${state?.data?.booking?.grandTotal?.toFixed(2)} `
                              : ""}
                        </strong>
                      </li>
                    </ul>
                    <div className="promo">
                      <h3>Promo Code</h3>
                      <div className="coupon_apply">
                        {" "}
                        <p onClick={() => setShowCoupon(true)}>
                          {promo?.code ? promo?.code : "Apply Coupon"}{" "}
                        </p>
                        <span
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
                          {promo?.code ? <CloseIcon /> : <ChevronRightIcon />}
                        </span>
                      </div>
                    </div>
                    <div></div>
                    <div
                      style={{ paddingBlockStart: "20px" }}
                      className="form_btn"
                    >
                      <button
                        style={{ width: "50%" }}
                        className="btn transparent"
                        onClick={() => navigate(`/parent/ClassDetail/${id}`)}
                      >
                        Cancel
                      </button>
                      <button
                        style={{ width: "50%" }}
                        className="btn primary"
                        onClick={BookClassFunc}
                        type="button"
                      // onClick={() => setOpen1(true)}
                      >
                        {isLoading ? (
                          <CircularProgress size={17} color="inherit" />
                        ) : (
                          "Pay Now"
                        )}
                      </button>
                    </div>
                  </div>
                  {/* <div className="whiteBox">
                                        <h2>Saved Cards</h2>
                                        <div className="control_group">
                                            <RadioGroup
                                                className="checkbox_label"
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group">
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
                                    </div> */}
                  {showCoupon ? (
                    <div className="whiteBox">
                      <h2>Promo Code</h2>
                      <div className="input_group control_group">
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
                                            state?.data?.booking?.grandTotal
                                            ? { backgroundColor: "gray" }
                                            : {}
                                        }
                                        disabled={
                                          item?.discountType ===
                                          DISCOUNT_TYPE.FLAT &&
                                          item?.discount >
                                          state?.data?.booking?.grandTotal
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
                    </div>
                  ) : null}
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
