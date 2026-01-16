import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Получаем параметры из query-строки, задаём значения по умолчанию
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    // Проверяем корректность параметров
    if (page < 1 || limit < 1) {
      return NextResponse.json(
        { error: 'Invalid pagination parameters' },
        { status: 400 }
      );
    }
    const offset = (page - 1) * limit;
    const data = await pool.query(
      `SELECT p.*, u.name AS author, 
      i.url AS image_url, i.alt AS image_alt 
      FROM posts p JOIN users u ON p.user_id = u.id
      LEFT JOIN images i ON p.id = i.post_id AND i.position = 0
      WHERE p.user_id = $1
      ORDER BY p.created_at DESC
      LIMIT $2 OFFSET $3;`,
      [id, limit, offset]
    );
    // Получаем общее количество записей
    const totalCountResult = await pool.query(
      `SELECT COUNT(*) as total FROM posts WHERE user_id = $1`,
      [id]
    );
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
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 200 });
  }
}