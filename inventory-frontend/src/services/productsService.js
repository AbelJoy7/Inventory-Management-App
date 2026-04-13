import API from "../api/api";

const productsService = {
  getAll: () => API.get("products/"),
  getLowStock: () => API.get("products/low_stock/"),
  getRestockRecommendations: () => API.get("products/restock_recommendations/"),
  getDemandForecast: (id) => API.get(`products/${id}/demand_forecast/`),
  create: (data) => API.post("products/", data),
  update: (id, data) => API.put(`products/${id}/`, data),
  delete: (id) => API.delete(`products/${id}/`),
  restock: (id, quantity) => API.post(`products/${id}/restock/`, { quantity }),
};

export default productsService;
