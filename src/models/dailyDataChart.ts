export interface DailyDataChart {
  dataMillis: number;
  saleQuantity: number | null;
  serviceQuantity: number | null;
}

export const dailyDataChartInitialState: DailyDataChart = {
  dataMillis: 0,
  saleQuantity: null,
  serviceQuantity: null,
};
