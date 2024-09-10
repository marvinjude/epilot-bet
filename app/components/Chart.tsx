//@ts-nocheck

"use client";

import { format } from "d3-format";

import React from "react";

import {
  Chart,
  ChartCanvas,
  CandlestickSeries,
  XAxis,
  YAxis,
  discontinuousTimeScaleProviderBuilder,
  OHLCTooltip,
  CrossHairCursor,
  withSize,
  withDeviceRatio,
} from "react-financial-charts";

export interface IOHLCData {
  openTime: Date;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface OHLCChartProps {
  data: IOHLCData[];
  width: number;
  ratio: number;
  height: number;
}

const OHLCChart: React.FC<OHLCChartProps> = ({
  data,
  width,
  ratio,
  height,
}) => {
  const margin = { left: 0, right: 48, top: 0, bottom: 24 };
  const xScaleProvider =
    discontinuousTimeScaleProviderBuilder().inputDateAccessor(
      (d: IOHLCData) => d.openTime
    );

  const pricesDisplayFormat = format(".2f");

  const {
    data: chartData,
    xScale,
    xAccessor,
    displayXAccessor,
  } = xScaleProvider(data);
  const max = xAccessor(chartData[chartData.length - 1]);
  const min = xAccessor(chartData[Math.max(0, chartData.length - 100)]);
  const xExtents = [min, max + 5];

  return (
    <ChartCanvas
      height={height}
      width={width}
      ratio={ratio}
      margin={margin}
      data={chartData}
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      seriesName="OHLC Data"
      xExtents={xExtents}
    >
      <Chart id={1} yExtents={(d: IOHLCData) => [d.high, d.low]}>
        <XAxis showGridLines showTicks={false} showTickLabel={false} />
        <YAxis showGridLines tickFormat={pricesDisplayFormat} />
        <CandlestickSeries />
        <OHLCTooltip origin={[10, 10]} />
      </Chart>
      <CrossHairCursor />
    </ChartCanvas>
  );
};

export const SimpleOHLCChart = withSize({ style: { minHeight: 500 } })(
  withDeviceRatio()(OHLCChart)
);
