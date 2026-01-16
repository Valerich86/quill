import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import { generateUniqueSlug, parseTextToJSX, postSchema } from "@/lib/utils";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const rawData = {
      title: formData.get("title")?.toString() || "",
      excerpt: formData.get("excerpt")?.toString() || "",
      content: formData.get("content")?.toString() || "",
      user_id: formData.get("user_id")?.toString() || "",
    };

    // Валидируем данные
    const validatedFields = await postSchema.safeParseAsync(rawData);

    if (!validatedFields.success) {
      // Собираем все ошибки валидации
      const errors = validatedFields.error.issues.reduce((acc, issue) => {
        const fieldName = String(issue.path[0]);
        acc[fieldName] = issue.message;
        return acc;
      }, {} as Record<string, string>);

      return NextResponse.json({ errors: errors }, { status: 400 });
    }

    const { title, excerpt, content, user_id } = validatedFields.data;
    const slug = await generateUniqueSlug(title);
    const processedContent = parseTextToJSX(content);

    const result = await pool.query(
      `INSERT INTO posts (title, excerpt, content, slug, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, slug;`,
      [title, excerpt, JSON.stringify(processedContent), slug, user_id]
    );
    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error("Ошибка добавления данных: ", error);
    return NextResponse.json({ status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Получаем параметры из query-строки, задаём значения по умолчанию
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const tagsString = searchParams.get("tags") || null;
    const tags = tagsString ? tagsString.split(", ") : null;
    const searchString = searchParams.get("searchString") || null;
    console.log(searchString);
    // Проверяем корректность параметров
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: "Invalid pagination parameters" },
        { status: 400 }
      );
    }
    const offset = (page - 1) * limit;
    let data;
    let totalCountResult;
    let heading = "Все статьи";
    if (tags) {
      data = await pool.query(
        `SELECT p.*, u.name AS author, 
        i.url AS image_url, i.alt AS image_alt 
        FROM posts p JOIN users u ON p.user_id = u.id
        LEFT JOIN images i ON p.id = i.post_id AND i.position = 0
        WHERE p.status = 'PUBLISHED'
        AND p.id IN (
          SELECT pt.post_id
          FROM post_tags pt
          WHERE pt.tag_id = ANY($1::uuid[])
        )
        ORDER BY p.published_at DESC
        LIMIT $2 OFFSET $3;`,
        [tags, limit, offset]
      );
      totalCountResult = await pool.query(
        `SELECT COUNT(*) as total FROM posts 
        WHERE status = 'PUBLISHED'
        AND id IN (
          SELECT pt.post_id
          FROM post_tags pt
          WHERE pt.tag_id = ANY($1::uuid[])
        );`,
        [tags]
      );
      const tagsData = await pool.query(
        `SELECT name FROM tags WHERE id = ANY($1::uuid[]);`, [tags]
      );
      let tagNames = "";
      tagsData.rows.forEach(tag => {
        tagNames += `#${tag.name}`
      });
      heading = `Результат поиска по тегам "${tagNames}"`;
    } else if (searchString) {
      data = await pool.query(
        `SELECT p.*, u.name AS author, 
        i.url AS image_url, i.alt AS image_alt 
        FROM posts p JOIN users u ON p.user_id = u.id
        LEFT JOIN images i ON p.id = i.post_id AND i.position = 0
        WHERE p.status = 'PUBLISHED'
        AND (
          p.title ILIKE $3
          OR p.excerpt ILIKE $3
          OR p.content ILIKE $3
        )
        ORDER BY p.published_at DESC
        LIMIT $1 OFFSET $2;`,
        [limit, offset, `%${searchString}%`]
      );
      totalCountResult = await pool.query(
        `SELECT COUNT(*) as total FROM posts 
        WHERE status = 'PUBLISHED'
        AND (
          title ILIKE $1
          OR excerpt ILIKE $1
          OR content ILIKE $1
        );`, [`%${searchString}%`]
      );
      heading = `Результат поиска по строке "${searchString}..."`;
    } else {
      data = await pool.query(
        `SELECT p.*, u.name AS author, 
        i.url AS image_url, i.alt AS image_alt 
        FROM posts p JOIN users u ON p.user_id = u.id
        LEFT JOIN images i ON p.id = i.post_id AND i.position = 0
        WHERE p.status = 'PUBLISHED'
        ORDER BY p.published_at DESC
        LIMIT $1 OFFSET $2;`,
        [limit, offset]
      );
      totalCountResult = await pool.query(
        `SELECT COUNT(*) as total FROM posts 
        WHERE status = 'PUBLISHED';`
      );
    }

    const totalCount = parseInt(totalCountResult.rows[0].total, 10);
    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json({
      data: data.rows,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      heading: heading
    });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 200 });
  }
}
