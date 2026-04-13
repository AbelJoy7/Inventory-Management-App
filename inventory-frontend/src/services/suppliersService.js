import API from "../api/api";

const suppliersService = {
  getAll: () => API.get("suppliers/"),
  getById: (id) => API.get(`suppliers/${id}/`),
  create: (data) => API.post("suppliers/", data),
  update: (id, data) => API.put(`suppliers/${id}/`, data),
  delete: (id) => API.delete(`suppliers/${id}/`),
};

export default suppliersService;
