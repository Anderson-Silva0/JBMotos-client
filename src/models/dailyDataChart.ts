export interface DailyDataChart {
  dataMillis: number;
  saleQuantity: number | null;
  repairQuantity: number | null;
}

export const dailyDataChartInitialState: DailyDataChart = {
  dataMillis: 0,
  saleQuantity: null,
  repairQuantity: null,
};
