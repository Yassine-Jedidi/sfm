import { BASE_URL, N8N_URL } from "@/constants/api";
import axios from "axios";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
export const api2 = axios.create({
  baseURL: N8N_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

