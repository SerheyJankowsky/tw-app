import { socket, SocketConnection } from "@/shared/socket";
import {
  Bar,
  HistoryCallback,
  IDatafeedChartApi,
  LibrarySymbolInfo,
  ResolutionString,
} from "../../public/tradingview/charting_library";
import { SubscribeBarsCallback } from "../../public/tradingview/datafeed-api";
import { PeriodParamsWithOptionalCountback } from "../../public/tradingview/datafeeds/udf/src/history-provider";
import { UDFCompatibleDatafeed } from "../../public/tradingview/datafeeds/udf/src/udf-compatible-datafeed";
const base_url = process.env.UDF_LOCAL;
const updateInterval = 5000;

type GetBarsResult = {
  c: number;
  h: number;
  l: number;
  o: number;
  t: number;
  v: number;
  version: number;
};

export class Datafeed
  extends UDFCompatibleDatafeed
  implements IDatafeedChartApi
{
  private socket: SocketConnection;
  private subscribers: Record<string, any>;
  private symbolsSubscribed: Record<string, string> = {};

  constructor() {
    super(base_url as string, updateInterval);
    this.socket = socket;
    this.subscribers = {};
  }
  resolveSymbol(
    symbolName: string,
    onResolve: any,
    onError: any,
    extension: any
  ) {
    setTimeout(
      () =>
        onResolve({
          name: symbolName,
          ticker: symbolName,
          type: "crypto",
          session: "24x7",
          timezone: "Etc/UTC",
          minmov: 1,
          pricescale: 100, // ETH обычно 2 знака после запятой
          has_intraday: true,
          has_daily: true,
          has_weekly_and_monthly: true,
          supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D"],
        }),
      0
    );
  }
  async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParamsWithOptionalCountback,
    onResult: HistoryCallback,
    onError: any
  ) {
    return super.getBars(
      symbolInfo,
      resolution,
      periodParams,
      onResult,
      onError
    );
  }

  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    onResetCacheNeededCallback: () => void
  ): void {
    this.subscribers[listenerGuid] = onTick;
    // Expect server to emit events like: { time, open, high, low, close, volume }
    console.log("socket in Datafeed", this.socket);
    this.socket.subscribe("candle", (data: GetBarsResult) => {
      console.log("Data received from server in Datafeed:", data);
      let cbData: Bar = {
        time: data.t * 1000, // TradingView expects time in milliseconds
        open: data.o,
        high: data.h,
        low: data.l,
        close: data.c,
        volume: data.v,
      };
      Object.values(this.subscribers).forEach((cb) => cb(cbData));
    });

    // Optionally tell server what we subscribe to
    this.socket.emit("subscribe", `${symbolInfo.name}_${resolution}`);
    this.symbolsSubscribed[listenerGuid] = `${symbolInfo.name}_${resolution}`;
  }

  public unsubscribeBars(listenerGuid: string): void {
    this.socket.emit("unsubscribe", this.symbolsSubscribed[listenerGuid]);
    delete this.subscribers[listenerGuid];
    delete this.symbolsSubscribed[listenerGuid];
  }
}
