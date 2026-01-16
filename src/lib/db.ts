import { Pool } from "pg";

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),

  // Опциональные параметры пула
  max: 20,           // макс. число клиентских соединений
  idleTimeoutMillis: 30000, // закрыть соединение после 30 сек бездействия
  connectionTimeoutMillis: 2000, // таймаут подключения
});

// Обработка ошибок пула
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

export default pool;
