import { ApiService } from "./apiService";

export const DailyDataChartService = () => {
  const url = "/daily-data-chart";

  const fetchChartData = () => {
    return ApiService.get(url);
  };

  return {
    fetchChartData,
  };
};
