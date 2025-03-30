import { ApiService } from "./apiService";

export const DailyDataChartService = () => {
  const url = "/dailyDataChart";

  const fetchChartData = () => {
    return ApiService.get(url);
  };

  return {
    fetchChartData,
  };
};
