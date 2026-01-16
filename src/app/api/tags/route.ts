import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import pool from "@/lib/db";
import slugify from "slugify";
import { font_default } from "@/lib/fonts";

const sqlInjectionPattern =
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|OR|AND)\b|\-\-|;|\*|\(|\)|\'|")/gi;

const tagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Тег должен содержать минимум 2 символа")
    .max(50, "Тег не может быть длиннее 50 символов")
    .regex(/^[a-zA-Zа-яА-Я0-9._ -]+$/, {
      message:
      "Недопустимые символы в имени файла. Используйте только буквы, цифры, пробелы, дефисы и подчёркивания",
    })
    .refine((name) => !sqlInjectionPattern.test(name), {
      message: "Обнаружены потенциально опасные символы или SQL-команды",
    })
    .transform(name => name.toLowerCase())
});

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const validatedFields = await tagSchema.safeParseAsync({
      name: formData.get("name")?.toString() || "",
    });
    if (!validatedFields.success) {
      const errors = validatedFields.error.issues.reduce((acc, issue) => {
        const fieldName = String(issue.path[0]);
        acc[fieldName] = issue.message;
        return acc;
      }, {} as Record<string, string>);
      return NextResponse.json({ errors: errors }, { status: 400 });
    }

    const { name } = validatedFields.data;

    const result = await pool.query(
      `INSERT INTO tags (name) VALUES ($1) RETURNING id;`,
      [name]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Ошибка добавления данных: ", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const data = await pool.query(`SELECT * FROM tags ORDER BY name ASC;`);
    return NextResponse.json(data.rows);
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 200 });
  }
}
