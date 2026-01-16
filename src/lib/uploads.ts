import { writeFile, unlink, access } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import sharp from "sharp";

// Допустимые типы файлов
const allowedTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

// Максимальный размер файла (5 МБ)
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export async function uploadFile(file: File) {

  if (!file) return {filePath: undefined}
  // Проверка типа файла
  if (!allowedTypes.includes(file.type)) {
    return { error: "Недопустимый тип файла. Разрешены только изображения" };
  }

  // Проверка размера файла
  if (file.size > MAX_FILE_SIZE) {
    return { error: "Файл слишком большой. Максимальный размер — 20 МБ" };
  }

  // Читаем буфер файла
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Преобразуем в WebP с помощью sharp
  const webpBuffer = await sharp(buffer)
    .webp({
      quality: 80, // качество от 1 до 100
      effort: 4, // скорость сжатия (0–6)
    })
    .toBuffer();

  // Генерируем уникальное имя файла
  const filename = `${randomUUID()}.webp`;

  // Путь для сохранения (в public/uploads)
  const filePath = join(process.cwd(), "public", "uploads", filename);

  // Создаём папку, если не существует
  await writeFile(filePath, webpBuffer);

  // Возвращаем относительный путь для использования в src
  const publicPath = `/uploads/${filename}`;

  // return {
  //   filePath: publicPath,
  //   filename: filename,
  //   originalSize: buffer.length,
  //   webpSize: webpBuffer.length,
  //   compressionRatio:
  //     (((buffer.length - webpBuffer.length) / buffer.length) * 100).toFixed(1) +
  //     "%",
  // };
  return {filePath: publicPath};
}

export async function deleteFile (url:string) {
  try {
    // Формируем полный путь к файлу
    const filePath = join(process.cwd(), "public", url);

    // Проверяем существование файла
    try {
      await access(filePath);
    } catch (error) {
      return { success: false, error: "Файл не найден" };
    }

    // Удаляем файл
    await unlink(filePath);

    return {success: true};
  } catch (error) {
    console.error("Ошибка при удалении файла:", error);
    return {
      success: false,
      error: "Ошибка при удалении файла",
      details: error instanceof Error ? error.message : String(error)
    };
  }
}

