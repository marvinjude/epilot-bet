import axios from "axios";

interface iFetchPriceHistory {
  /**
   * The market symbol to fetch data for (e.g. BTCUSDT)
   */
  symbol?: string;

  /**
   * Interval for the data
   */
  interval?: "1m" | "5m" | "15m" | "1h" | "4h" | "1d"; //... and so on. keep it simple

  /**
   * The limit of data points to fetch e.g (300 data points)
   */
  limit?: number;

  /**
   * The start time of the data to fetch
   * Default is 5 hours ago
   */
  startTime?: number;
}

const get5HoursAgoTimeStamp = () => Date.now() - 5 * 60 * 60 * 1000;

export const fetchPriceHistory = async ({
  symbol = "BTCUSDT",
  interval = "1m",
  startTime = get5HoursAgoTimeStamp(),
  limit = 300,
}: iFetchPriceHistory) => {
  const currentTime = Date.now();

  const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${currentTime}&limit=${limit}`;

  const response = await axios.get<[]>(url);
  const data = response.data;

  /**
   * Massage data into OHLC format
   *
   * See format here: https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Kline-Candlestick-Data#response-example
   */
  const ohlcData = data.map((candle) => ({
    openTime: new Date(candle[0]),
    open: parseFloat(candle[1]),
    high: parseFloat(candle[2]),
    low: parseFloat(candle[3]),
    close: parseFloat(candle[4]),
    closeTime: new Date(candle[6]),
  }));

  return ohlcData;
};
