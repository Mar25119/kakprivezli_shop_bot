# 🛍️ Kak Privezli — Telegram Mini App интернет-магазина деликатесов

Telegram Mini App для магазина премиальных деликатесов с полным функционалом интернет-магазина: каталог, корзина, оформление заказов, избранное, личный кабинет.

![Статус проекта](https://img.shields.io/badge/status-ready-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-6-green)


---

##  Возможности

### Для покупателя
-  **Каталог товаров** с фильтрацией по категориям и поиском
-  **Карточка товара** с фото, описанием, вариантами и выбором количества
-  **Корзина** с изменением количества и удалением позиций
-  **Оформление заказа** с валидацией формы
-  **Избранное** — сохранение понравившихся товаров
-  **История заказов** со статусами
-  **Рекомендации** на основе просмотренных товаров
-  **Личный кабинет** с данными из Telegram

### Для администратора
-  **Уведомления о новых заказах** прямо в Telegram
-  **Полная информация** о заказе: клиент, адрес, товары, сумма
-  **Управление каталогом** через API (добавление/редактирование товаров)

---

##  Технологии

### Backend
- **Node.js** + **Express** — серверное приложение
- **MongoDB** + **Mongoose** — база данных и ORM
- **Telegraf** — отправка уведомлений в Telegram

### Frontend
- **React 18** — пользовательский интерфейс
- **Zustand** — управление состоянием
- **Axios** — HTTP-запросы
- **Telegram WebApp API** — интеграция с Telegram

### Инфраструктура
- **Docker** + **Docker Compose** — контейнеризация
- **Nginx** — веб-сервер и проксирование
- **ngrok** — HTTPS-туннель для локальной разработки

---

##  Структура проекта

```
kak-privezli-app/
├── backend/                 # Серверная часть (Node.js + Express)
│   ├── config/              # Конфигурация (БД)
│   ├── controllers/         # Обработчики запросов
│   ├── middleware/          # Промежуточное ПО (аутентификация)
│   ├── models/              # Модели данных (Mongoose)
│   ├── routes/              # Маршруты API
│   ├── scripts/             # Скрипты (заполнение БД)
│   ├── uploads/             # Загруженные файлы
│   └── server.js            # Точка входа
│
├── frontend/                # Клиентская часть (React)
│   ├── public/              # Статические файлы
│   └── src/
│       ├── components/      # Переиспользуемые компоненты
│       ├── pages/           # Страницы приложения
│       ├── services/        # API-сервисы
│       ├── store/           # Zustand store
│       ├── App.jsx          # Главный компонент
│       └── index.js         # Точка входа
│
├── telegram-bot/            # Telegram-бот (Telegraf)
│   └── bot.js               # Логика бота
│
├── docker-compose.yml       # Docker конфигурация
├── nginx.conf               # Конфигурация Nginx
── README.md                # Документация
```

---

## 🚀 Быстрый старт

### Требования
- Node.js 18+
- MongoDB 6+ (или Docker)
- Telegram Bot Token (от [@BotFather](https://t.me/BotFather))

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd kak-privezli-app
```

### 2. Настройка переменных окружения

Скопируйте примеры и заполните реальными значениями:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp telegram-bot/.env.example telegram-bot/.env
```

**backend/.env:**
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/kak-privezli
TELEGRAM_BOT_TOKEN=ваш_токен_от_BotFather
ADMIN_CHAT_ID=ваш_telegram_id
CORS_ORIGIN=http://localhost:3001
```

**frontend/.env:**
```env
REACT_APP_API_URL=http://localhost:3000/api
```

**telegram-bot/.env:**
```env
BOT_TOKEN=ваш_токен_от_BotFather
API_URL=http://localhost:3000/api
WEB_APP_URL=https://your-domain.com/
ADMIN_CHAT_ID=ваш_telegram_id
```

### 3. Запуск MongoDB

**Вариант A — Docker :**
```bash
docker-compose up -d mongodb
```

**Вариант B — локальная установка:**
Установите MongoDB с официального сайта и запустите сервис.

### 4. Установка зависимостей и заполнение БД

```bash
cd backend
npm install
npm run seed
cd ..
```

### 5. Запуск сервисов

Откройте **3 терминала**:

**Терминал 1 — Backend:**
```bash
cd backend
npm run dev
```

**Терминал 2 — Frontend:**
```bash
cd frontend
npm install
npm start
```

**Терминал 3 — Telegram Bot:**
```bash
cd telegram-bot
npm install
npm start
```

### 6. Настройка Telegram WebApp

Для локальной разработки используйте **ngrok**:

```bash
ngrok http 3001
```

Скопируйте HTTPS URL и настройте бота:

1. Откройте [@BotFather](https://t.me/BotFather)
2. `/mybots` → выберите бота → **Bot Settings** → **Menu Button**
3. Укажите URL: `https://ваш--url.ngrok.io/`
4. Название кнопки: `🛍️ Магазин`

---

##  API Endpoints

### Категории
- `GET /api/categories` — список категорий

### Товары
- `GET /api/products` — все товары
- `GET /api/products/category/:id` — товары по категории
- `GET /api/products/:id` — товар по ID

### Избранное
- `GET /api/favorites` — список избранных
- `POST /api/favorites/toggle` — добавить/удалить из избранного

### Заказы
- `POST /api/orders` — создать заказ
- `GET /api/orders` — история заказов пользователя
- `GET /api/orders/:id` — детали заказа

### Рекомендации
- `GET /api/recommendations` — товары на основе просмотров

---

##  Docker (альтернативный запуск)

Запуск всех сервисов одной командой:

```bash
docker-compose up -d
```

Просмотр логов:
```bash
docker-compose logs -f
```

Остановка:
```bash
docker-compose down
```

---

##  Деплой на продакшн

### Требования
- VPS (Ubuntu 22.04, 1GB RAM, 20GB SSD)
- Домен с настроенной A-записью
- SSL-сертификат (Let's Encrypt)

### Шаги деплоя

1. **Установка зависимостей на сервере:**
```bash
apt update && apt upgrade -y
apt install -y nodejs mongodb nginx
npm install -g pm2
```

2. **Загрузка проекта:**
```bash
cd /var/www
git clone <repository-url> kak-privezli-app
cd kak-privezli-app
```

3. **Установка и сборка:**
```bash
cd backend && npm install --production && cd ..
cd frontend && npm install && npm run build && cd ..
cd telegram-bot && npm install --production && cd ..
```

4. **Запуск через PM2:**
```bash
cd backend && pm2 start server.js --name "backend" && cd ..
cd telegram-bot && pm2 start bot.js --name "bot" && cd ..
pm2 save && pm2 startup
```

5. **Настройка Nginx и SSL:**
```bash
# Конфигурация Nginx (см. nginx.conf)
certbot --nginx -d your-domain.com
```

6. **Обновление URL в BotFather:**
Укажите `https://your-domain.com/` в настройках Menu Button.

---

##  Добавление товаров

### Через API

```bash
POST /api/products
Content-Type: application/json

{
  "name": {
    "ru": "Название товара",
    "en": "Product Name"
  },
  "description": {
    "ru": "Описание товара",
    "en": "Product description"
  },
  "price": 2500,
  "category": "ObjectId_категории",
  "mainImage": "https://example.com/image.jpg",
  "stock": 100,
  "variants": [
    { "name": { "ru": "Вариант 1" }, "price": 2500 }
  ]
}
```

### Через скрипт seed.js

Отредактируйте `backend/scripts/seed.js` и запустите:
```bash
cd backend
npm run seed
```
