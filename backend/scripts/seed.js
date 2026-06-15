require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

const categories = [
  {
    name: { ru: 'Масло и молочные продукты', en: 'Butter & Dairy' },
    description: 'Премиальные молочные продукты',
    order: 1
  },
  {
    name: { ru: 'Выпечка и десерты', en: 'Bakery & Desserts' },
    description: 'Изысканная выпечка',
    order: 2
  },
  {
    name: { ru: 'Закуски', en: 'Snacks' },
    description: 'Вкусные закуски',
    order: 3
  }
];

const products = [
  {
    name: { ru: 'Масло Beurre d\'Isigny', en: 'Beurre d\'Isigny Butter' },
    description: {
      ru: 'Изысканное французское сливочное масло с защищённым наименованием происхождения. Производится в Нормандии из сливок молока коров, пасущихся на богатых минеральными солями прибрежных лугах региона Изиньи-сюр-Мер. Отличается особенно нежной, шелковистой текстурой и насыщенным, глубоким сливочным вкусом с лёгкими ореховыми и молочными оттенками.',
      en: 'Exquisite French butter with protected designation of origin.'
    },
    price: 2500,
    category: null,
    mainImage: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?w=500',
    stock: 100,
    variants: [
      { name: { ru: 'Соленое', en: 'Salted' }, price: 2500 },
      { name: { ru: 'Сладкое', en: 'Sweet' }, price: 2500 },
      { name: { ru: 'Классическое', en: 'Classic' }, price: 2500 }
    ]
  },
  {
    name: { ru: 'Печенье Савоярди', en: 'Savoiardi Cookies' },
    description: {
      ru: 'Итальянское печенье для тирамису. Классический рецепт из яичных белков, сахара и муки. Идеально подходит для приготовления тирамису и других десертов.',
      en: 'Italian cookies for tiramisu.'
    },
    price: 750,
    category: null,
    mainImage: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500',
    stock: 200
  },
  {
    name: { ru: 'Таралли с чесноком и оливковым маслом', en: 'Taralli with Garlic and Olive Oil' },
    description: {
      ru: 'Итальянские хрустящие колечки с чесноком и оливковым маслом. Идеальная закуска к вину.',
      en: 'Italian crunchy rings with garlic and olive oil.'
    },
    price: 650,
    category: null,
    mainImage: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500',
    stock: 150
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories`);

    // Assign categories to products
    products[0].category = createdCategories[0]._id;
    products[1].category = createdCategories[1]._id;
    products[2].category = createdCategories[2]._id;

    // Create products
    const createdProducts = await Product.insertMany(products);
    console.log(`✅ Created ${createdProducts.length} products`);

    console.log('🎉 Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seed();