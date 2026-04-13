import API from "../api/api";

const categoriesService = {
  getAll: () => API.get("categories/"),
  getById: (id) => API.get(`categories/${id}/`),
  create: (data) => API.post("categories/", data),
  update: (id, data) => API.put(`categories/${id}/`, data),
  delete: (id) => API.delete(`categories/${id}/`),
};

export default categoriesService;
