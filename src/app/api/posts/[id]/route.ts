import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { generateUniqueSlug, parseTextToJSX, postSchema } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const postData = await pool.query(
      `SELECT p.*, u.name AS author FROM posts p  
      JOIN users u ON u.id = p.user_id
      WHERE p.id = $1;`,
      [id]
    );
    const imagesData = await pool.query(
      `SELECT * FROM images WHERE post_id = $1 ORDER BY position ASC;`,
      [id]
    );
    const tagsData = await pool.query(
      `SELECT t.* FROM tags t 
      JOIN post_tags pt ON t.id = pt.tag_id
      WHERE pt.post_id = $1 ORDER BY t.name ASC;`,
      [id]
    );
    const commentsData = await pool.query(
      `SELECT c.*, u.name AS author FROM comments c
      JOIN users u ON u.id = c.user_id
      WHERE c.post_id = $1 ORDER BY c.created_at DESC;`,
      [id]
    );
    return NextResponse.json({
      post: postData.rows[0],
      images: imagesData.rows,
      tags: tagsData.rows,
      comments: commentsData.rows
    });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (body.publish) {
      await pool.query(
        "UPDATE posts SET status = 'PUBLISHED', published_at = NOW()  WHERE id = $1;", 
        [id]
      );
      return NextResponse.json({ status: 204 });
    }
    if (body.addView) {
      await pool.query(
        "UPDATE posts SET views = views + 1 WHERE id = $1;", 
        [id]
      );
      return NextResponse.json({ status: 204 });
    }
    // Валидируем данные
    const validatedFields = await postSchema.safeParseAsync(body);

    if (!validatedFields.success) {
      // Собираем все ошибки валидации
      const errors = validatedFields.error.issues.reduce((acc, issue) => {
        const fieldName = String(issue.path[0]);
        acc[fieldName] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({ errors: errors }, { status: 400 });
    }

    const { title, excerpt, content } = validatedFields.data;
    const slug = await generateUniqueSlug(title);
    const processedContent = parseTextToJSX(content);

    await pool.query(
      "UPDATE posts SET title = $1, excerpt = $2, content = $3, slug = $4 WHERE id = $5",
      [title, excerpt, JSON.stringify(processedContent), slug, id]
    );
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка изменения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await pool.query("DELETE FROM posts WHERE id=$1;", [id]);
    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.error("Ошибка удаления данных:", error);
    return NextResponse.json({ status: 500 });
  }
}
