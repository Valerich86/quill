import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { commentSchema } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const rawData = {
      content: formData.get("content")?.toString() || "",
      user_id: formData.get("user_id")?.toString() || "",
      post_id: formData.get("post_id")?.toString() || "",
    };

    // Валидируем данные
    const validatedFields = await commentSchema.safeParseAsync(rawData);

    if (!validatedFields.success) {
      // Собираем все ошибки валидации
      const errors = validatedFields.error.issues.reduce((acc, issue) => {
        const fieldName = String(issue.path[0]);
        acc[fieldName] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({ errors: errors }, { status: 400 });
    }

    const { content, user_id, post_id } = validatedFields.data;
    const result = await pool.query(
      `INSERT INTO comments (content, user_id, post_id) VALUES ($1, $2, $3) RETURNING id;`,
      [content, user_id, post_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Ошибка добавления данных: ", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE (request: NextRequest) {
  try {
    const {id} = await request.json();
    console.log(id)
    await pool.query("DELETE FROM comments WHERE id = $1", [id]);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка удаления данных: ", error);
    return NextResponse.json({status: 500});
  }

}

