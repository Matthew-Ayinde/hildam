import { jwtDecode, JwtPayload } from "jwt-decode";

interface CustomJwtPayload extends JwtPayload {
  role?: string;
}

//get access_token from session storage
export function getToken() {
  return sessionStorage.getItem("access_token");
}

export function decodeToken(token: string) {
  try {
    const decoded = jwtDecode<CustomJwtPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp && decoded.exp < currentTime) {
      return { valid: false, role: null };
    }
    return { valid: true, role: decoded.role };
  } catch (error) {
    return { valid: false, role: null };
  }
}
