import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ post_id: string }> }
) {
  try {
    const { post_id } = await params;
    const result = await pool.query("SELECT * FROM images WHERE post_id = $1 ORDER BY position ASC", [
      post_id,
    ]);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("Ошибка получения данных:", error);
    return NextResponse.json({ status: 500 });
  }
}