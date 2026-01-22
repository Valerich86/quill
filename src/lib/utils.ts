import slugify from "slugify";
import { ParsedLine } from "@/lib/types";
import pool from "./db";
import z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Заголовок должен содержать минимум 2 символа")
    .max(200, "Заголовок не может быть длиннее 200 символов"),
  excerpt: z
    .string()
    .trim()
    .min(2, "Описание должно содержать минимум 2 символа")
    .max(300, "Описание не может быть длиннее 300 символов"),
  content: z
    .string()
    .trim()
    .min(2, "Контент должен содержать минимум 2 символа"),
  user_id: z.string().optional(),
});

export const commentSchema = z.object({
  content: z
    .string()
    .trim()
    .min(2, "Контент должен содержать минимум 2 символа"),
  user_id: z.string(),
  post_id: z.string(),
});

// Функция генерации уникального slug
export async function generateUniqueSlug(title: string) {
  let baseSlug = slugify(title, { lower: true, strict: true, locale: "ru" });
  let slug = baseSlug;
  let counter = 1;
  // Проверяем уникальность slug в БД
  while (await isSlugExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  return slug;
}

// Проверка существования slug
const isSlugExists = async (slug: string) => {
  const result = await pool.query("SELECT 1 FROM posts WHERE slug = $1", [
    slug,
  ]);
  if (!result.rowCount) return false;
  return result.rowCount > 0;
};

export function parseTextToJSX(text: string): ParsedLine[] {
  return text
    .split("\n")
    .map((line) =>
      line.startsWith("!!")
        ? { type: "heading", content: line.slice(2).trim() }
        : line.startsWith("==")
        ? { type: "offset", content: line.slice(2).trim() }
        : { type: "paragraph", content: line }
    );
}

export function parseJSXToText(parsedLines: ParsedLine[]): string {
  return parsedLines
    .map((line) => {
      switch (line.type) {
        case "heading":
          return `!!${line.content}`;
        case "offset":
          return `==${line.content}`;
        case "paragraph":
          return line.content;
        default:
          return line.content;
      }
    })
    .join("\n");
}
