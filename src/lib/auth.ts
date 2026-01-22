import { SignJWT, jwtVerify } from "jose";

const secretKey = new TextEncoder()
.encode(process.env.JWT_SECRET);
const alg = "HS256";

// Создание токена (вход)
export async function createSessionToken(
  id: string,
  name: string,
  avatar: string | undefined
) {
  return new SignJWT({ id, name, avatar })
    .setProtectedHeader({ alg })
    .setExpirationTime("1d")
    .sign(secretKey);
}

// Проверка токена (получение пользователя)
export async function verifySession() {
  try {
    const cookieStore = await import("next/headers")
    .then((mod) => mod.cookies());
    const token = cookieStore.get("session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secretKey);
    return {
      id: payload.id as string,
      name: payload.name as string,
      avatar: payload.avatar as string,
    };
  } catch {
    return null;
  }
}
