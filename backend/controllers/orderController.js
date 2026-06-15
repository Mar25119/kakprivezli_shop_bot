const Order = require('../models/Order');
const Product = require('../models/Product');
const { Telegraf } = require('telegraf');

// Create order
exports.createOrder = async (req, res) => {
  try {
    const { items, customerInfo, promoCode, telegramId } = req.body;
    
    let totalAmount = 0;
    const orderItems = [];
    
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        orderItems.push({
          product: product._id,
          name: product.name.ru,
          price: product.price,
          quantity: item.quantity,
          image: product.mainImage
        });
      }
    }
    
    const order = new Order({
      user: req.user?._id,
      telegramId,
      items: orderItems,
      totalAmount,
      customerInfo,
      promoCode
    });
    
    await order.save();
    
    // Send notification to admin
    if (process.env.TELEGRAM_BOT_TOKEN && process.env.ADMIN_CHAT_ID) {
      try {
        const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
        const message = 
          ` <b>Новый заказ #${order._id.toString().slice(-6)}</b>\n\n` +
          `💰 <b>Сумма:</b> ${totalAmount} ₽\n` +
          `👤 <b>Клиент:</b> ${customerInfo.name}\n` +
          `📞 <b>Телефон:</b> ${customerInfo.phone}\n` +
          `📍 <b>Адрес:</b> ${customerInfo.address}\n\n` +
          `<b>Товары:</b>\n` +
          orderItems.map(item => 
            `• ${item.name} - ${item.quantity} шт. x ${item.price} ₽`
          ).join('\n') +
          (customerInfo.comment ? `\n\n<b>Комментарий:</b> ${customerInfo.comment}` : '');
        
        await bot.telegram.sendMessage(process.env.ADMIN_CHAT_ID, message, {
          parse_mode: 'HTML'
        });
      } catch (err) {
        console.error('Failed to send Telegram notification:', err);
      }
    }
    
    res.json({ success: true, orderId: order._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 
      $or: [
        { user: req.user._id },
        { telegramId: req.user.telegramId }
      ]
    })
    .sort({ createdAt: -1 })
    .populate('items.product');
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product');
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};