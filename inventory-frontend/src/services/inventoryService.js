import API from "../api/api";

const inventoryService = {
  getAll: () => API.get("inventory/"),
  getById: (id) => API.get(`inventory/${id}/`),
  create: (data) => API.post("inventory/", data),
  update: (id, data) => API.put(`inventory/${id}/`, data),
  delete: (id) => API.delete(`inventory/${id}/`),
};

export default inventoryService;
