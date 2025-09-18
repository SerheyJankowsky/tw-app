"use client";

import { Datafeed } from "@/classes/DataFees";
import { useSocketConnection } from "@/shared/hooks/useSocketConnection";
import { useEffect, useRef } from "react";

const defaultWidgetProps = {
  symbol: "ETHUSDT",
  interval: "15",
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
  const candleSeriesRef = useRef();
  const props = defaultWidgetProps;
  useSocketConnection();
  useEffect(() => {
    const widgetOptions = {
      symbol: props.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // @ts-ignore
      datafeed: new Datafeed(),
      interval: props.interval,
      container: chartContainerRef.current,
      library_path: props.library_path,
      locale: props.locale,
      disabled_features: [
        "use_localstorage_for_settings",
        "header_symbol_search",
      ],
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

  // useEffect(() => {
  //   let listener = (data: any) => {
  //     console.log("Data received from server:", data);
  //   };
  //   // socket.emit("subscribe", "BTCUSDT_1m");
  //   socket.subscribe("candle", listener);
  //   return () => {
  //     // socket.unsubscribe("candle", listener);
  //     socket.emit("unsubscribe", "BTCUSDT_1m");
  //   };
  // }, []);

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
