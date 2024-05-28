// import common from "../../helpers/common";

const msToMinutes = (ms) => {
  return ms / 1000 / 60;
};

class ChartInterval {
  constructor(options) {
    const findedInterval = this.defineInterval(options);
    const margin = this.getMarginOffset({ from: options.from, to: options.to });

    console.log("Entry values: ", options);

    this.#values.interval = this.chartInterval[findedInterval];
    this.#values.from = margin.from;
    this.#values.to = margin.to;
  }

  #values = { interval: 0, from: 0, to: 0 };

  intervals = [1, 5, 15, 30, 60, 120, 240, 1440, 10080, 43200];
  chartInterval = {
    1: "1",
    5: "1",
    15: "3",
    30: "3",
    60: "5",
    120: "5",
    240: "15",
    740: "15",
    1440: "1H",
    5440: "4H",
    10080: "12H",
    43200: "1D",
  };
  from = 0;
  to = 0;

  defineRange(from, to) {
    const range = to - from;
    return range;
  }

  defineInterval(options) {
    const minutesFrom = msToMinutes(options.from);
    const minutesTo = msToMinutes(options.to);

    const range = this.defineRange(minutesFrom, minutesTo);

    console.log("Range", range);

    let foundIntervals = null;

    this.intervals.forEach((i, index) => {
      if (!foundIntervals && !this.intervals[index + 1]) {
        foundIntervals = i;
        return;
      }

      if (index === 0) {
        if (range < i) {
          foundIntervals = i;
          return;
        }
      }

      if (range >= i && range < this.intervals[index + 1]) {
        foundIntervals = i;
      }
    });

    return foundIntervals;
  }

  getMarginOffset(ranges) {
    ranges.from = Math.round(ranges.from - this.calculateMarginOffset(ranges));
    ranges.to = Math.round(ranges.to + this.calculateMarginOffset(ranges) / 2);

    return ranges;
  }

  calculateMarginOffset({ from, to }) {
    let range = this.defineRange(from, to);

    if (msToMinutes(range) < 10) {
      range = 0.5 * 1000 * 60 * 60;
    }

    const margin = range * 0.8;
    return margin;
  }

  get getValues() {
    console.log("Timeframe", this.#values.interval);

    return this.#values;
  }
}

export default ChartInterval;
