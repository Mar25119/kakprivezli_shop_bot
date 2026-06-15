require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');

const bot = new Telegraf(process.env.BOT_TOKEN);
const WEB_APP_URL = process.env.WEB_APP_URL || 'https://your-domain.com/';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// ========== КОМАНДЫ ==========

// /start — приветствие
bot.start(async (ctx) => {
  const user = ctx.from;
  await ctx.reply(
    `👋 Добро пожаловать, ${user.first_name}!\n\n` +
    `Я бот магазина *Kak Privezli*.\n` +
    `Здесь вы найдёте премиальные продукты с доставкой.\n\n` +
    `Нажмите кнопку "🛍️ Магазин" в меню слева или выберите действие:`,
    {
      parse_mode: 'Markdown',
      ...Markup.keyboard([
        ['🛒 Каталог', '📦 Мои заказы'],
        ['❤️ Избранное', '👤 Профиль'],
        ['ℹ️ Помощь']
      ]).resize()
    }
  );
});

// /shop — открыть магазин
bot.command('shop', (ctx) => {
  ctx.reply(
    '🛍️ Открываю магазин...',
    Markup.inlineKeyboard([
      Markup.button.webApp('🛍️ Открыть магазин', WEB_APP_URL)
    ])
  );
});

// /help — помощь
bot.command('help', (ctx) => sendHelp(ctx));

// ========== ОБРАБОТЧИКИ КНОПОК МЕНЮ ==========

bot.hears('🛒 Каталог', (ctx) => {
  ctx.reply(
    'Открыть каталог товаров:',
    Markup.inlineKeyboard([
      Markup.button.webApp('🛍️ Каталог', `${WEB_APP_URL}#/catalog`)
    ])
  );
});

bot.hears('📦 Мои заказы', (ctx) => {
  ctx.reply(
    'Ваши заказы:',
    Markup.inlineKeyboard([
      Markup.button.webApp('📦 Заказы', `${WEB_APP_URL}#/orders`)
    ])
  );
});

bot.hears('❤️ Избранное', (ctx) => {
  ctx.reply(
    'Ваши избранные товары:',
    Markup.inlineKeyboard([
      Markup.button.webApp('❤️ Избранное', `${WEB_APP_URL}#/favorites`)
    ])
  );
});

bot.hears('👤 Профиль', (ctx) => {
  ctx.reply(
    'Ваш профиль:',
    Markup.inlineKeyboard([
      Markup.button.webApp('👤 Профиль', `${WEB_APP_URL}#/profile`)
    ])
  );
});

bot.hears('ℹ️ Помощь', (ctx) => sendHelp(ctx));

// ========== ОБРАБОТЧИК ДАННЫХ ИЗ WEBAPP ==========

bot.on('web_app_data', async (ctx) => {
  try {
    const data = JSON.parse(ctx.message.web_app_data.data);
    
    if (data.type === 'order_created') {
      // Пользователь оформил заказ через WebApp
      const order = data.order;
      
      await ctx.reply(
        `✅ Заказ #${order.id.toString().slice(-6)} успешно оформлен!\n\n` +
        `💰 Сумма: ${order.totalAmount.toLocaleString()} ₽\n` +
        `📦 Товаров: ${order.items.length}\n\n` +
        `Мы свяжемся с вами в ближайшее время для подтверждения.`,
        Markup.keyboard([
          ['🛒 Каталог', ' Мои заказы'],
          ['❤️ Избранное', '👤 Профиль'],
          ['ℹ️ Помощь']
        ]).resize()
      );
      
      // Уведомление админу
      await notifyAdmin(order);
    }
  } catch (error) {
    console.error('Error processing web_app_data:', error);
  }
});

// ========== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ==========

function sendHelp(ctx) {
  return ctx.reply(
    '📞 *Служба поддержки*\n\n' +
    '📧 Email: support@kakprivezli.ru\n' +
    '💬 Telegram: @kakprivezli_support\n' +
    ' Работаем ежедневно с 9:00 до 21:00\n\n' +
    '*Как сделать заказ:*\n' +
    '1. Откройте магазин через кнопку "🛍️ Магазин"\n' +
    '2. Выберите товары и добавьте в корзину\n' +
    '3. Оформите заказ, указав адрес доставки\n' +
    '4. Дождитесь подтверждения от менеджера',
    {
      parse_mode: 'Markdown',
      ...Markup.keyboard([
        [' Каталог', '📦 Мои заказы'],
        ['❤️ Избранное', '👤 Профиль'],
        ['ℹ️ Помощь']
      ]).resize()
    }
  );
}

async function notifyAdmin(order) {
  if (!ADMIN_CHAT_ID) return;
  
  try {
    const itemsList = order.items
      .map(item => `• ${item.name} — ${item.quantity} шт. × ${item.price} ₽`)
      .join('\n');
    
    const message = 
      `🛒 <b>Новый заказ #${order.id.toString().slice(-6)}</b>\n\n` +
      `💰 <b>Сумма:</b> ${order.totalAmount.toLocaleString()} ₽\n` +
      `👤 <b>Клиент:</b> ${order.customerInfo.name}\n` +
      `📞 <b>Телефон:</b> ${order.customerInfo.phone}\n` +
      `📍 <b>Адрес:</b> ${order.customerInfo.address}\n\n` +
      `<b>Товары:</b>\n${itemsList}\n` +
      (order.customerInfo.comment 
        ? `\n<b>Комментарий:</b> ${order.customerInfo.comment}` 
        : '');
    
    await bot.telegram.sendMessage(ADMIN_CHAT_ID, message, {
      parse_mode: 'HTML'
    });
  } catch (error) {
    console.error('Failed to notify admin:', error);
  }
}

// ========== НАСТРОЙКИ БОТА ==========

// Установка команд меню
bot.telegram.setMyCommands([
  { command: 'start', description: ' Начать работу' },
  { command: 'shop', description: '🛍️ Открыть магазин' },
  { command: 'help', description: 'ℹ️ Помощь' }
]).catch(err => console.log('setMyCommands error (normal for non-admin tokens):', err.message));

// Установка кнопки WebApp в меню
try {
  bot.telegram.setChatMenuButton({
    type: 'web_app',
    text: '🛍️ Магазин',
    web_app: { url: WEB_APP_URL }
  });
} catch (err) {
  console.log('setChatMenuButton error:', err.message);
}

// Обработка ошибок
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
});

// ========== ЗАПУСК ==========

bot.launch();
console.log('✅ Telegram bot started');

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('SIGINT received, stopping bot...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('SIGTERM received, stopping bot...');
  bot.stop('SIGTERM');
});