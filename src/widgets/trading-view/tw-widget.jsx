// TradingViewWidget.js

import React, { useEffect, useRef } from "react";
import s from "./TradeViewChart.module.scss";
let tvScriptLoadingPromise;

export default function TradingViewWidget({ order }) {
  const onLoadScriptRef = useRef();
  //   const refContainer = useRef	(null);
  //   const timezoneOffset = new Date().getTimezoneOffset() * 60 * 60 * 1000;

  useEffect(() => {
    onLoadScriptRef.current = createWidget;

    if (!tvScriptLoadingPromise) {
      tvScriptLoadingPromise = new Promise((resolve) => {
        const script = document.createElement("script");
        script.id = "tradingview-widget-loading-script";
        script.src = "https://s3.tradingview.com/tv.js";
        script.type = "text/javascript";
        script.onload = resolve;

        document.head.appendChild(script);
      });
    }

    tvScriptLoadingPromise.then(
      () => onLoadScriptRef.current && onLoadScriptRef.current(),
    );

    return () => (onLoadScriptRef.current = null);

    function createWidget() {
      if (!order.symbol) return;

      function getParameterByName(name) {
        // eslint-disable-next-line
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        const regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(window.location.search);
        return results === null
          ? ""
          : decodeURIComponent(results[1].replace(/\+/g, " "));
      }

      if (
        document.getElementById("tradingview_412df") &&
        "TradingView" in window
      ) {
        const widget = (window.tvWidget = new window.TradingView.widget({
          debug: false,
          width: "100%",
          heigth: "100%",
          fullscreen: false,
          symbol: order.symbol,
          interval: "15", // Таймфрейм графика 15 минут
          // timeframe: { from: 1640995200, to: 1643673600 }, // Отображение графика за определенный период UNIX (timestamp / 1000)
          // container: refContainer.current,
          container_id: "tradingview_412df",

          //   library_path: "charting_library/",
          header_widget_buttons_mode: "compact",
          locale: getParameterByName("lang") || "en",
          disabled_features: [
            "use_localstorage_for_settings",
            "header_symbol_search",
            "left_toolbar",
            "timeframes_toolbar",
            "create_volume_indicator_by_default",
            "control_bar",
            "header_fullscreen_button",
            "header_settings",
            "drawing_templates",
            "display_market_status",
            "header_undo_redo",
            "header_indicators",
            "header_compare",
            "header_saveload",
            "main_series_scale_menu",
            "header_screenshot",
            "context_menus",
            "streaming_chart",
          ],
          // enabled_features: ["study_templates"],
          // charts_storage_url: "https://saveload.tradingview.com",
          // charts_storage_api_version: "1.1",
          //   client_id: "tradingview.com",
          //   user_id: "public_user_id",
          //   theme: getParameterByName("theme"),
          overrides: {
            "paneProperties.background": "white",
            "paneProperties.vertGridProperties.color": "transparent",
            "paneProperties.horzGridProperties.color": "transparent",
            "scalesProperties.textColor": "#AAA",
            "mainSeriesProperties.candleStyle.upColor": "white",
            "mainSeriesProperties.candleStyle.downColor": "black",
            "mainSeriesProperties.candleStyle.borderUpColor": "black",
            "mainSeriesProperties.candleStyle.borderDownColor": "black",
            "mainSeriesProperties.candleStyle.wickUpColor": "black",
            "mainSeriesProperties.candleStyle.wickDownColor": "black",
          },
          studies_overrides: {
            "volume.volume.color.0": "red",
          },
        }));
        // console.log(widget.chart);
        widget.ready(() => {
          console.log(widget.chart);
        });
        // widget.ready((e) => {
        //   order.trades.forEach((trade, index) => {
        //     const nextTrade = order.trades[index + 1];

        //     // console.log({
        //     //   timestamp: new Date(trade.date) + timezoneOffset,
        //     //   localSide: trade.localSide,
        //     //   price: trade.price,
        //     // });

        //     widget.createShape(
        //       {
        //         time: Math.round(trade.date / 1000),
        //       },
        //       {
        //         shape: trade.localSide === "Sell" ? "arrow_up" : "arrow_down",
        //       }
        //     );

        //     if (!nextTrade) return;

        //     widget.activeChart().createMultipointShape(
        //       [
        //         {
        //           time: Math.round(trade.date / 1000),

        //           price: trade.price,
        //         }, // from
        //         {
        //           time: Math.round(nextTrade.date / 1000),
        //           price: nextTrade.price,
        //         }, // to
        //       ],
        //       {
        //         shape: "trend_line",
        //         bold: true,
        //         lock: true,
        //         disableSelection: true,
        //         disableSave: true,
        //         disableUndo: true,
        //         // text: "text",
        //         overrides: {
        //           linestyle: 3,
        //           zOrder: "top",
        //         },
        //       }
        //     );
        //   });

        //   // console.log("ORDER :", {
        //   //   date: new Date(order.entryDate).getTime() + timezoneOffset,
        //   // });

        //   widget.activeChart().dataReady(() => {
        //     order.trades.forEach((trade, index) => {
        //       const nextTrade = order.trades[index + 1];

        //       // console.log({
        //       //   timestamp: new Date(trade.date) + timezoneOffset,
        //       //   localSide: trade.localSide,
        //       //   price: trade.price,
        //       // });

        //       widget.activeChart().createShape(
        //         {
        //           time: Math.round((trade.date + timezoneOffset) / 1000),
        //         },
        //         {
        //           shape: trade.localSide === "Sell" ? "arrow_up" : "arrow_down",
        //         }
        //       );

        //       if (!nextTrade) return;

        //       widget.activeChart().createMultipointShape(
        //         [
        //           {
        //             time: Math.round((trade.date + timezoneOffset) / 1000),

        //             price: trade.price,
        //           }, // from
        //           {
        //             time: Math.round((nextTrade.date + timezoneOffset) / 1000),
        //             price: nextTrade.price,
        //           }, // to
        //         ],
        //         {
        //           shape: "trend_line",
        //           bold: true,
        //           lock: true,
        //           disableSelection: true,
        //           disableSave: true,
        //           disableUndo: true,
        //           // text: "text",
        //           overrides: {
        //             linestyle: 3,
        //             zOrder: "top",
        //           },
        //         }
        //       );
        //     });

        //     // ПИСАТЬ ТУТ

        //     // widget.activeChart().createShape(

        //     //   { time: 1520812800, channel: "high" },
        //     //   {
        //     //     text: "PNL 20%",
        //     //     shape: "icon",
        //     //     zOrder: "top",
        //     //     icon: "0xF0D7",
        //     //     lock: true,
        //     //     disableSelection: true,
        //     //     showLabel: true,
        //     //   }
        //     // );

        //     // widget.activeChart().setChartType(1);

        //     // widget.activeChart().getSeries().setChartStyleProperties(1, {
        //     //   upColor: "white",
        //     //   downColor: "black",
        //     //   borderUpColor: "black",
        //     //   borderDownColor: "black",
        //     //   wickUpColor: "black",
        //     //   wickDownColor: "black",
        //     // });
        //   });
        // });
      }
    }
  }, [order]);

  return (
    <div className={s.tradingview_wrapper}>
      <div className={s.chart} id="tradingview_412df" />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/symbols/NASDAQ-AAPL/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="blue-text">AAPL stock chart</span>
        </a>{" "}
        by TradingView
      </div>
    </div>
  );
}
