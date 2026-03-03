import axios from "axios";

const api = axios.create({
  baseURL: "https://projedata-api.netlify.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
