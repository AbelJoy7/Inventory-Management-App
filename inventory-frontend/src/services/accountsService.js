import API from "../api/api";

const accountsService = {
  getAll: () => API.get("accounts/"),
  getById: (id) => API.get(`accounts/${id}/`),
  create: (data) => API.post("accounts/", data),
  update: (id, data) => API.put(`accounts/${id}/`, data),
  delete: (id) => API.delete(`accounts/${id}/`),
};

export default accountsService;
