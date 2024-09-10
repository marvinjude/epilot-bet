"use client";

import { useState, useEffect, useRef } from "react";
import { geologica } from "../fonts";

const formatAmountToUserLocal = (amount: number) => {
  const truncatedAmount = Number(Number(amount).toFixed(2));

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    currencyDisplay: "narrowSymbol",
  }).format(truncatedAmount);
};

interface IBinancePriceEvent {
  p: string;
  q: string;
  T: number;
  m: boolean;
  M: boolean;
}

export const RealTimePrice = ({ defaultPrice }: { defaultPrice: number }) => {
  const [price, setPrice] = useState<{
    value: number;
    higherThanPrev: boolean;
  }>({
    value: defaultPrice,
    higherThanPrev: false,
  });

  const lastPriceRef = useRef(0);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");

    ws.addEventListener("message", function (event: MessageEvent<string>) {
      const data = JSON.parse(event.data) as IBinancePriceEvent;
      const price = +data.p;

      setPrice({
        value: price,
        higherThanPrev: price >= lastPriceRef.current,
      });

      /**
       * As we receive new data, we want to update price history
       * TODO: Figure out how to update price history appropriately
       */

      lastPriceRef.current = price;
    });

    () => {
      ws.close();
    };
  }, []);

  return (
    <p
      className={`${
        geologica.className
      } text-3xl border-r pr-10 w-48 font-bold ${
        price?.higherThanPrev ? "text-green-500" : "text-red-500"
      }`}
    >
      {price?.value && `${formatAmountToUserLocal(price.value)}`}
    </p>
  );
};
