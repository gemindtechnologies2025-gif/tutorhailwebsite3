import { EXCHANGE_KEY } from "../constants/url";


export const convertCurrency = ({
  price,
  rate,
}: {
  price: number;
  rate: number;
}) => {
  const result = price * rate;

  return isNaN(result) ? price : result;
};


export const convertCurrencyNew = async ({
  baseCurrency,
  targetCurrency,
  amount,
}: {
  baseCurrency: string;
  targetCurrency: string;
  amount: number;
}): Promise<{converted: string; rate: number} | null> => {
  try {
    const res = await fetch(
      `https://v6.exchangerate-api.com/v6/${EXCHANGE_KEY}/latest/${baseCurrency}`,
    );
    const data = await res.json();
    const rate = data?.conversion_rates?.[targetCurrency];
    if (rate) {
      const convertedAmount = (amount * rate).toFixed(2);
      return {converted: convertedAmount, rate};
    }
    return null;
  } catch (e) {
    console.error('Currency conversion failed:', e);
    return null;
  }
};