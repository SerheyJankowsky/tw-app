"use client";

import { useEffect, useRef } from "react";

const API_KEY = "neKQsvlDZgotALnOHZOkbuTpJOmspKw5";
const DATAFEED =
  "https://api.polygon.io/v2/aggs/ticker/AAPL/range/1/day/2023-01-08/2023-01-09?adjusted=true&sort=asc&limit=120&apiKey=neKQsvlDZgotALnOHZOkbuTpJOmspKw5";

const defaultWidgetProps = {
  symbol: "BTCUSDT",
  interval: "1D",
  library_path: "/tradingview/",
  locale: "en",
  base_url: process.env.UDF_LOCAL,
  charts_storage_url: "https://saveload.tradingview.com",
  charts_storage_api_version: "1.1",
  client_id: "tradingview.com",
  user_id: "public_user_id",
  fullscreen: false,
  autosize: true,
  intervalUpdateChart: 10000,
};

const Chart = () => {
  const chartContainerRef = useRef();
  const props = defaultWidgetProps;

  useEffect(() => {
    const widgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      //@ts-ignore
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(
        defaultWidgetProps.base_url,
        defaultWidgetProps.intervalUpdateChart,
        {
          maxResponseLength: 1000,
          expectedOrder: "latestFirst",
        }
      ),
      interval: props.interval,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale,
      disabled_features: ["use_localstorage_for_settings"],
      enabled_features: ["study_templates"],
      charts_storage_url: props.charts_storage_url,
      charts_storage_api_version: props.charts_storage_api_version,
      client_id: props.client_id,
      user_id: props.user_id,
      fullscreen: props.fullscreen,
      autosize: props.autosize,
      theme: "dark",
    };

    // const widget = new window.TradingView.widget({
    //@ts-ignore
    const tvWidget = new window.TradingView.widget(widgetOptions);

    tvWidget.onChartReady(() => {
      tvWidget.headerReady().then(() => {
        const button = tvWidget.createButton();
        button.setAttribute("title", "Click to show a notification popup");
        button.classList.add("apply-common-tooltip");
        button.addEventListener("click", () =>
          tvWidget.showNoticeDialog({
            title: "Notification",
            body: "TradingView Charting Library API works correctly",
            callback: () => {
              console.log("Noticed!");
            },
          })
        );

        button.innerHTML = "Check API";
      });
    });

    return () => {
      tvWidget.remove();
    };
  }, [props]);

  return (
    <>
      <div //@ts-ignore
        ref={chartContainerRef}
        className={"h-full w-full"}
      />
    </>
  );
};

export default Chart;
