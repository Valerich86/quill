'use client';


import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const consentDate = localStorage.getItem('cookieConsentDate');

    if (!consent || !consentDate) {
      setShowBanner(true);
      return;
    }

    // Проверяем, не истёк ли срок хранения (1 год = 365 дней)
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    const storedDate = new Date(consentDate).getTime();
    const now = Date.now();

    if (now - storedDate > oneYearInMs) {
      // Срок истёк — очищаем старые данные и показываем баннер снова
      localStorage.removeItem('cookieConsent');
      localStorage.removeItem('cookieConsentDate');
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-700 max-w-2xl">
            Мы используем файлы cookie для улучшения работы сайта, анализа трафика и персонализации контента.
            Подробнее читайте в нашей{' '}
            <a
              href="/privacy-policy"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Политике конфиденциальности
            </a>.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleReject}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Отклонить
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Принять
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
