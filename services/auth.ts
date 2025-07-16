import { api } from "./api";

export async function signIn(username: string, password: string) {
  try {
    const response = await api.post("login_check", { username, password });
    return { ...response.data, ok: true };
  } catch (error: any) {
    if (error.response) {
      return { ...error.response.data, ok: false };
    }
    return { message: "Network error", ok: false };
  }
} 