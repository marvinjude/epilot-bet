/**
 * Fetches the current price of Bitcoin from the Binance API.
 */
export const getCurrentBitcoinPrice = async () => {
  const url =
    "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USDT";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const price = data["USDT"];
  return price;
};
