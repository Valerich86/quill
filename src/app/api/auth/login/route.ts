"use server";

import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { User } from "@/lib/types";
import { createSessionToken } from "@/lib/auth";

async function checkAvailability(
  email: string,
  password: string
): Promise<User | null> {
  try {
    const data = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    if (data.rows.length === 0) return null;
    let user: User = data.rows[0];
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) return null;
    else return user;
  } catch (error) {
    throw new Error("Ошибка проверки данных пользователя.");
  }
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString() || "";
  const password = formData.get("password")?.toString() || "";
  const user = await checkAvailability(email, password);
  if (!user) {
    return new Response(
      JSON.stringify({ error: "Ошибка входа. Проверьте введенные данные!" }),
      { status: 406 }
    );
  }
  const token = await createSessionToken(user.id, user.name, user.avatar);

  return NextResponse.json({ success: true }, {
    status: 200,
    headers: {
      "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`,
      "Content-Type": "application/json",
    },
  });
}
