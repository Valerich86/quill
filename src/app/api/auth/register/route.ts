import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/lib/uploads";
import z from "zod";
import pool from "@/lib/db";
import bcrypt from "bcrypt";
import { createSessionToken } from "@/lib/auth";

type UploadedFile = {
  error?: string;
  filePath?: string;
};

// проверка логина
async function checkEmailAvailability(email: string): Promise<Boolean> {
  try {
    const data = await pool.query(`SELECT * FROM users WHERE email=$1`, [
      email,
    ]);
    return data.rows.length > 0 ? false : true;
  } catch (error) {
    throw new Error("Ошибка проверки данных почты.");
  }
}

const userSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не может быть длиннее 50 символов"),
  email: z
    .string()
    .trim()
    .email("Введите корректный email")
    .refine(
      async (value) => {
        const isAvailable = await checkEmailAvailability(value);
        return isAvailable;
      },
      { message: "Email уже занят" }
    ),
  bio: z
    .string()
    .trim()
    .max(500, "Био не может быть длиннее 500 символов")
    .optional(), // поле необязательно
  password: z
    .string()
    .trim()
    .min(8, "Пароль должен содержать не менее 8 символов")
    .refine(
      (password) => {
        const hasLowercase = /[a-z]/.test(password);
        const hasUppercase = /[A-Z]/.test(password);
        const hasDigit = /\d/.test(password);

        return hasLowercase && hasUppercase && hasDigit;
      },
      {
        message:
          "Пароль должен содержать латинские буквы (верхнего и нижнего регистра) и цифры",
      }
    ),
  confirm: z.string(),
});

const validatedSchema = userSchema.refine(
  (data) => data.password === data.confirm,
  {
    message: "Пароли не совпадают",
    path: ["confirm"],
  }
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const rawData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      bio: formData.get("bio")?.toString() || undefined,
      password: formData.get("password")?.toString() || "",
      confirm: formData.get("confirm")?.toString() || "",
    };

    // Валидируем данные
    const validatedFields = await validatedSchema.safeParseAsync(rawData);

    if (!validatedFields.success) {
      // Собираем все ошибки валидации
      const errors = validatedFields.error.issues.reduce((acc, issue) => {
        const fieldName = String(issue.path[0]);
        acc[fieldName] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({ errors: errors }, { status: 400 });
    }
    const file = (formData.get("avatar") as File);
    let fileUploadResult: UploadedFile = {};
    if (file.size !== 0) {
      fileUploadResult = await uploadFile(file);

      if (fileUploadResult.error) {
        return NextResponse.json(
          { errors: { avatar: fileUploadResult.error } },
          { status: 400 }
        );
      }
    }
    // Если валидация пройдена, получаем очищенные данные
    const { name, email, password, bio } = validatedFields.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, bio, avatar, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, avatar;`,
      [name, email, bio, fileUploadResult.filePath, hashedPassword]
    );
    const newUser = result.rows[0];
    // установка файла cookie
    const token = await createSessionToken(
      newUser.id,
      newUser.name,
      newUser.avatar
    );
    return NextResponse.json(
      { success: true },
      {
        status: 200,
        headers: {
          "Set-Cookie": `session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Ошибка добавления данных: ", error);
    return NextResponse.json({ status: 500 });
  }
}
