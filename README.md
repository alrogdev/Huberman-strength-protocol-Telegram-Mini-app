# Huberman Strength Protocol — Telegram Mini App

Трекер силового фитнес-протокола Эндрю Хубермана, реализованный как Telegram Mini App.

## Стек

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Vercel Serverless Functions (Node.js)
- **Хранилище**: Upstash Redis
- **Авторизация**: Telegram initData HMAC-SHA256

## Структура проекта

```
├── api/                    # Vercel Serverless Functions
│   ├── workouts.ts         # CRUD тренировок
│   ├── workouts/[id].ts    # Операции с отдельной тренировкой
│   ├── sets.ts             # Создание подходов
│   ├── sets/[id].ts        # Операции с подходом
│   ├── settings.ts         # Настройки пользователя
│   └── user/[telegramId].ts # Полный дамп данных пользователя
├── lib/                    # Серверные утилиты
│   ├── telegram.ts         # Валидация initData (HMAC-SHA256)
│   └── storage.ts          # Работа с Upstash Redis
├── src/                    # React-фронтенд
│   ├── pages/              # Страницы приложения
│   ├── lib/                # Клиентские утилиты и контексты
│   ├── components/ui/      # UI-компоненты (shadcn)
│   └── hooks/              # React-хуки
├── vercel.json             # Конфигурация Vercel
└── package.json
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `TELEGRAM_BOT_TOKEN` | Токен бота из @BotFather |
| `UPSTASH_REDIS_REST_URL` | URL Upstash Redis REST API |
| `UPSTASH_REDIS_REST_TOKEN` | Токен Upstash Redis REST API |

## Развёртывание

### 1. Создайте базу Upstash Redis

1. Зайдите на [console.upstash.com](https://console.upstash.com)
2. Создайте новую Redis-базу (регион: EU-West-1 или ближайший)
3. Скопируйте `UPSTASH_REDIS_REST_URL` и `UPSTASH_REDIS_REST_TOKEN`

### 2. Задеплойте на Vercel

```bash
# Клонируйте репозиторий
git clone https://github.com/alrogdev/Huberman-strength-protocol-Telegram-Mini-app.git
cd Huberman-strength-protocol-Telegram-Mini-app

# Установите зависимости
npm install

# Задеплойте
vercel --prod
```

Или подключите репозиторий через [Vercel Dashboard](https://vercel.com/new).

### 3. Настройте переменные окружения в Vercel

В разделе Settings → Environment Variables добавьте:
- `TELEGRAM_BOT_TOKEN` = ваш токен бота
- `UPSTASH_REDIS_REST_URL` = URL из Upstash
- `UPSTASH_REDIS_REST_TOKEN` = токен из Upstash

### 4. Настройте Mini App в BotFather

```
/setmenubutton
```

Выберите бота, затем укажите:
- URL: `https://ваш-домен.vercel.app`
- Текст кнопки: `Трекер`

### 5. Откройте приложение

Перейдите в чат с ботом @Fittram_bot и нажмите кнопку меню.

## Локальная разработка

```bash
npm install
npm run dev
```

Фронтенд запустится на `http://localhost:5173`. API-функции работают только при деплое на Vercel (или с `vercel dev`).

## Протокол Хубермана

7-дневный цикл:
1. **Длительное кардио** — Зона 2, 60-75 мин
2. **Ноги** — Квадрицепсы, бицепс бедра, икры
3. **Восстановление** — Сауна, холод, NSDR
4. **Торс** — Грудь, спина, плечи, шея
5. **Среднее кардио** — 35 мин на 75-80%
6. **ВИИТ** — Спринт-интервалы
7. **Руки, икры, шея** — Бицепс, трицепс

Периодизация: месяц A (сила, 4-8 повт.) → месяц B (гипертрофия, 8-15 повт.)

## Лицензия

MIT
