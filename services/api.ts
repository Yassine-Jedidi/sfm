import { BASE_URL } from "@/constants/api";
import axios from "axios";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
export const api2 = axios.create({
  baseURL: "http://localhost:5678",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export const sendChatPrompt = async (prompt: string, token: string, userId: string) => {
  const response = await api2.post(
    "/webhook-test/cosap_chat",
    { prompt },
    { headers: { Authorization: `Bearer ${token}`, idUser: userId } }
  );
  return response.data;
}; 