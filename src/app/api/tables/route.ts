import pool from "../../../lib/db";

async function createExtention() {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createUsersTable() {
  try {
    pool.query(
      `CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,  -- хешированный пароль
        avatar VARCHAR(500),
        bio TEXT,
        role VARCHAR(20) DEFAULT 'USER',  -- USER/EDITOR/ADMIN
        created_at DATE DEFAULT CURRENT_DATE
      );`
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createPostsTable() {
  try {
    pool.query(
      `CREATE TABLE IF NOT EXISTS posts (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        slug VARCHAR(200) UNIQUE NOT NULL,  -- для URL
        content TEXT NOT NULL,
        excerpt VARCHAR(300),
        status VARCHAR(20) DEFAULT 'DRAFT',  -- DRAFT/PUBLISHED/ARCHIVED
        published_at TIMESTAMP,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createImagesTable() {
  try {
    pool.query(
      `CREATE TABLE IF NOT EXISTS images (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        url TEXT NOT NULL,          -- ссылка на файл
        alt TEXT,                  -- альтернативный текст (для SEO/доступности)
        caption TEXT,               -- подпись к изображению
        position INTEGER NOT NULL   -- порядок отображения в статье
      );`
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createTagsTable() {
  try {
    pool.query(
      `CREATE TABLE IF NOT EXISTS tags (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL
      );`
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createPostTagsTable() {
  try {
    pool.query(
      `CREATE TABLE IF NOT EXISTS post_tags (
        post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
        tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, tag_id)
      );`
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createCommentsTable() {
  try {
    pool.query(
      `CREATE TABLE IF NOT EXISTS comments (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        content TEXT NOT NULL,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`
    );
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

async function createIndexes() {
  try {
    pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);`);
    pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);`);
    pool.query(`CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);`);
    pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts(status) WHERE status = 'PUBLISHED';`);
    pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_status_published_at ON posts(status, published_at DESC);`);
    pool.query(`CREATE INDEX IF NOT EXISTS idx_images_post_id_position ON images(post_id, position);`);
    pool.query(`CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);`);
    pool.query(`CREATE INDEX IF NOT EXISTS idx_images_post_id ON images(post_id);`);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await createExtention();
    await createUsersTable();
    await createPostsTable();
    await createImagesTable();
    await createTagsTable();
    await createPostTagsTable();
    await createCommentsTable();
    await createIndexes();
    return Response.json({ message: "База данных создана / обновлена" });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}