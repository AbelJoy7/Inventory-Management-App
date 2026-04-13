import API from "../api/api";

const analyticsService = {
  getTopProducts: (timePeriod = 'all') => API.get(`analytics/top-products/?time_period=${timePeriod}`),
  getMonthlySales: (timePeriod = 'all') => API.get(`analytics/monthly-sales/?time_period=${timePeriod}`),
  getStockDistribution: () => API.get("analytics/stock-distribution/"),
  getSummary: (timePeriod = 'all') => API.get(`analytics/summary/?time_period=${timePeriod}`),
};

export default analyticsService;
