import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ post_id: string }> }
) {
  try {
    const { post_id } = await params;
    const {tags} = await request.json();
    for (let t of tags) {
      const result = await pool.query(
        `INSERT INTO post_tags (post_id, tag_id) VALUES ($1, $2);`,
        [post_id, t]
      );
    }

    return NextResponse.json({ status: 201 });
  } catch (error) {
    console.error("Ошибка добавления данных: ", error);
    return NextResponse.json({ status: 500 });
  }
}
