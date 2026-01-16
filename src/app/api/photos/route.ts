import { NextResponse, NextRequest } from "next/server";
import pool from "@/lib/db";
import { uploadFile, deleteFile } from "@/lib/uploads";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const caption = formData.get("caption") as string;
  const alt = caption;
  const post_id = formData.get("post_id") as string;

  try {
    const fileUploadResult = await uploadFile(file);
    if (fileUploadResult.error) {
      return NextResponse.json(
        { errors: { avatar: fileUploadResult.error } },
        { status: 400 }
      );
    }
    const position = await getPosition(post_id);
    const result = await pool.query(
      `INSERT INTO images (url, caption, alt, post_id, position) VALUES ($1, $2, $3, $4, $5);`,
      [fileUploadResult.filePath, caption, alt, post_id, position]
    );
    return NextResponse.json({ status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Ошибка добавления данных" },
      { status: 500 }
    );
  }
}

async function getPosition(post_id: string): Promise<number> {
  try {
    const data = await pool.query(
      `SELECT position FROM images WHERE post_id=$1 ORDER BY position DESC`,
      [post_id]
    );
    if (data.rows.length === 0) return 0;
    console.log(data.rows);
    return data.rows[0].position + 1;
  } catch (error) {
    throw new Error("Ошибка проверки данных пользователя.");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { url, id } = await request.json();
    await pool.query("DELETE FROM images WHERE id = $1", [id]);
    const result = await deleteFile(url);
    if (result.success) {
      return NextResponse.json({ status: 204 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
