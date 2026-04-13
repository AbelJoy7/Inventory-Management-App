import API from "../api/api";

const ordersService = {
  getAll: () => API.get("orders/"),
  getById: (id) => API.get(`orders/${id}/`),
  create: (data) => API.post("orders/", data),
  update: (id, data) => API.put(`orders/${id}/`, data),
  delete: (id) => API.delete(`orders/${id}/`),
};

export default ordersService;
