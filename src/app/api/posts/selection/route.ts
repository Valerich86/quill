import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Получаем параметры из query-строки, задаём значения по умолчанию
    const { searchParams } = new URL(request.url);
    const criteria = searchParams.get("criteria");
    const limit = parseInt(searchParams.get("limit") || "5");
    console.log(criteria);
    if (!['published_at', 'views'].includes(criteria!)) {
      return NextResponse.json({ status: 500 });
    }
    const data = await pool.query(
      `SELECT p.id, p.slug, p.title, i.url AS image_url
        FROM posts p JOIN images i ON p.id = i.post_id AND i.position = 0
        WHERE p.status = 'PUBLISHED'
        ORDER BY p.${criteria} DESC
        LIMIT $1;`, [limit]
    );
    return NextResponse.json(data.rows);
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 200 });
  }
}