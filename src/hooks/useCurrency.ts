import { useEffect, useRef } from "react";
import { selectCurrentCurrency, setCurrencyRates } from "../reducers/currencySlice";
import { useAppDispatch, useAppSelector } from "./store";
import { EXCHANGE_KEY } from "../constants/url";

const useExchangeCurrency = () => {
  const dispatch = useAppDispatch();
  // const curr:any = JSON.parse(localStorage.getItem('currency')||"")
  // console.log(curr,'38109d4f1a6f36c9840a0cbd');
  
  const fetchCurrencyRate = async () => {
    try {
      const res = await fetch(
        `https://v6.exchangerate-api.com/v6/${EXCHANGE_KEY}/latest/USD`
      );
      const data = await res.json();

      if (data?.result === "success") {
        const conversionRate = data?.conversion_rates;
        dispatch(setCurrencyRates(conversionRate));
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCurrencyRate();
  }, []);
};

export default useExchangeCurrency;
