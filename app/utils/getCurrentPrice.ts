export const getCurrentBitcoinPrice = async () => {
  const url = "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT";
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  const price = Number(data.price);
  return price;
};
