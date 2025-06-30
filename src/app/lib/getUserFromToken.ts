import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  id: number;
  email: string;
  name?: string; // tambahin kalau di token lo ada
}

export function getUserFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwtDecode<TokenPayload>(token);
    return decoded;
  } catch (err) {
    console.error("Gagal decode token", err);
    return null;
  }
}
