export const metadata = {
  title: "Политика конфиденциальности",
  description:
    "Описание использования файлов cookie и обработки персональных данных",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Политика конфиденциальности
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          1. Введение
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Настоящая Политика конфиденциальности описывает, как мы используем
          файлы cookie и обрабатываем персональные данные при использовании
          нашего веб‑сайта.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          2. Использование файлов cookie
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          При использовании нашего веб‑сайта мы применяем файлы cookie для
          обеспечения корректной работы системы аутентификации и поддержания
          пользовательской сессии.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            Основное cookie для аутентификации
          </h3>
          <p className="text-blue-800">
            Мы используем одно основное cookie для хранения токена сессии
            пользователя.
          </p>
        </div>

        <h3 className="text-xl font-medium text-gray-800 mb-3">
          Детали токена сессии
        </h3>
        <p className="text-gray-700 leading-relaxed mb-4">
          Токен сессии создаётся на сервере и содержит следующие данные:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>
            <strong>ID пользователя</strong> — уникальный идентификатор вашей
            учётной записи
          </li>
          <li>
            <strong>Имя пользователя</strong> — отображаемое имя в системе
          </li>
          <li>
            <strong>Аватар</strong> — ссылка на изображение профиля (если
            установлено)
          </li>
        </ul>

        <h3 className="text-xl font-medium text-gray-800 mb-3">
          Как обеспечивается безопасность
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li>
            <strong>Цифровая подпись</strong> — токен подписывается секретным
            ключом на сервере, что предотвращает его подделку
          </li>
          <li>
            <strong>Ограниченный срок действия</strong> — токен автоматически
            становится недействительным через 24 часа
          </li>
          <li>
            <strong>Шифрование</strong> — данные защищены алгоритмом HS256,
            который гарантирует их целостность
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          3. Параметры cookie
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Название</h3>
            <p className="text-gray-600">session</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Срок действия</h3>
            <p className="text-gray-600">24 часа (1 день)</p>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Безопасность</h3>
            <ul className="text-gray-600 list-disc list-inside">
              <li>HttpOnly — недоступно для JavaScript</li>
              <li>Secure — передаётся только по HTTPS</li>
              <li>SameSite=Strict — защита от CSRF‑атак</li>
            </ul>
          </div>
          <div className="bg-white border rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Назначение</h3>
            <p className="text-gray-600">
              Поддержание аутентифицированной сессии пользователя
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          4. Цели использования cookie
        </h2>
        <ul className="list-decimal list-inside text-gray-700 space-y-3">
          <li>
            Аутентификация пользователя — подтверждение вашей личности при
            доступе к защищённым разделам сайта.
          </li>
          <li>
            Поддержание сессии — сохранение состояния авторизации между
            страницами и посещениями.
          </li>
          <li>
            Безопасность — предотвращение несанкционированного доступа к учётной
            записи.
          </li>
          <li>
            Персонализация — отображение вашего имени и аватара в интерфейсе.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          5. Управление cookie
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Вы можете управлять настройками cookie через настройки вашего
          браузера. Однако отключение cookie аутентификации приведёт к
          невозможности использования защищённых разделов сайта и потребует
          повторной авторизации.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Для полного выхода из системы используйте функцию «Выйти» в
          пользовательском меню. Это приведёт к удалению cookie сессии с вашего
          устройства.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          6. Безопасность данных
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Мы принимаем следующие меры для защиты ваших данных:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Токен подписывается секретным ключом на сервере.</li>
          <li>
            Данные в токене зашифрованы и не могут быть изменены пользователем.
          </li>
          <li>Cookie имеет ограниченный срок действия (24 часа).</li>
          <li>Используются современные алгоритмы шифрования (HS256).</li>
          <li>Cookie защищено атрибутами HttpOnly и Secure.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          7. Контакты
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Если у вас есть вопросы относительно использования cookie или
          обработки персональных данных, вы можете связаться с нами по адресу:{" "}
          <a
            href="mailto:privacy@example.com"
            className="text-blue-600 hover:text-blue-800"
          >
            privacy@example.com
          </a>
        </p>
      </section>
    </div>
  );
}
