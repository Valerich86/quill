export async function GET() {
  return new Response(
    JSON.stringify({ success: true, message: 'Выход выполнен' }),
    {
      status: 200,
      headers: {
        'Set-Cookie': 'session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0',
        'Content-Type': 'application/json',
      },
    }
  );
}