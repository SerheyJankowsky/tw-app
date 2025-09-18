const datafeed = {
  onReady: () => {
    console.log("[onReady]: Method call");
  },
  searchSymbols: () => {
    console.log("[searchSymbols]: Method call");
  },
  resolveSymbol: async (symbolName) => {
    console.log("[resolveSymbol]: Method call", symbolName);
  },
  getBars: (symbolInfo) => {
    console.log("[getBars]: Method call", symbolInfo);
  },
  subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID) => {
    console.log(
      "[subscribeBars]: Method call with subscribeUID:",
      subscribeUID,
    );
  },
  unsubscribeBars: (subscriberUID) => {
    console.log(
      "[unsubscribeBars]: Method call with subscriberUID:",
      subscriberUID,
    );
  },
};

export default datafeed;
