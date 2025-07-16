import { api2 } from "./api";

export const sendChatPrompt = async (prompt: string, token: string, userId: string) => {
  const response = await api2.post(
    "/webhook-test/cosap_chat",
    { prompt },
    { headers: { Authorization: `Bearer ${token}`, idUser: userId } }
  );
  return response.data;
}; 