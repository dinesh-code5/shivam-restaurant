import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/User.js';
import MenuItem from './models/MenuItem.js';
import Table from './models/Table.js';
import WhatsappTemplate from './models/WhatsappTemplate.js';
import BirthdayCampaign from './models/BirthdayCampaign.js';
import QRCode from 'qrcode';

dotenv.config();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const menuData = [
  { name: 'Paneer Tikka', description: 'Cottage cheese marinated in spiced yogurt', price: 280, category: 'Starters', type: 'Veg', isFeatured: true },
  { name: 'Hara Bhara Kebab', description: 'Spinach and green pea patties', price: 220, category: 'Starters', type: 'Veg' },
  { name: 'Chicken Tikka', description: 'Tender chicken pieces marinated and char-grilled', price: 320, category: 'Starters', type: 'Non-Veg', isFeatured: true },
  { name: 'Tandoori Mushroom', description: 'Mushrooms stuffed with cheese, roasted in tandoor', price: 260, category: 'Starters', type: 'Veg' },
  { name: 'Tomato Dhaniya Shorba', description: 'Classic tomato coriander soup', price: 140, category: 'Soups', type: 'Veg' },
  { name: 'Hot & Sour Soup', description: 'Tangy and spicy soup with vegetables', price: 150, category: 'Soups', type: 'Veg' },
  { name: 'Chicken Clear Soup', description: 'Light chicken broth with herbs', price: 180, category: 'Soups', type: 'Non-Veg' },
  { name: 'Paneer Butter Masala', description: 'Cottage cheese in rich tomato and butter gravy', price: 320, category: 'Main Course', type: 'Veg', isFeatured: true },
  { name: 'Dal Makhani', description: 'Slow-cooked black lentils with cream and butter', price: 280, category: 'Main Course', type: 'Veg', isFeatured: true },
  { name: 'Shivam Special Thali', description: 'A royal platter of seasonal curries, dal, rice, breads and dessert', price: 450, category: 'Main Course', type: 'Veg', isFeatured: true },
  { name: 'Butter Chicken', description: 'Tender chicken in creamy tomato gravy', price: 380, category: 'Main Course', type: 'Non-Veg', isFeatured: true },
  { name: 'Kadhai Chicken', description: 'Chicken cooked with bell peppers in spicy kadhai masala', price: 360, category: 'Main Course', type: 'Non-Veg' },
  { name: 'Laal Maas', description: 'Traditional Rajasthani mutton curry', price: 480, category: 'Main Course', type: 'Non-Veg', isFeatured: true },
  { name: 'Mix Vegetable Curry', description: 'Seasonal vegetables in mild masala gravy', price: 260, category: 'Main Course', type: 'Veg' },
  { name: 'Tandoori Roti', description: 'Whole wheat bread baked in clay oven', price: 30, category: 'Breads', type: 'Veg' },
  { name: 'Butter Naan', description: 'Soft leavened bread brushed with butter', price: 50, category: 'Breads', type: 'Veg' },
  { name: 'Garlic Naan', description: 'Naan topped with fresh garlic and herbs', price: 65, category: 'Breads', type: 'Veg' },
  { name: 'Laccha Paratha', description: 'Multi-layered crispy whole wheat paratha', price: 60, category: 'Breads', type: 'Veg' },
  { name: 'Veg Biryani', description: 'Fragrant basmati rice with mixed vegetables', price: 260, category: 'Rice & Biryani', type: 'Veg' },
  { name: 'Chicken Biryani', description: 'Aromatic basmati rice layered with marinated chicken', price: 340, category: 'Rice & Biryani', type: 'Non-Veg', isFeatured: true },
  { name: 'Jeera Rice', description: 'Basmati rice tempered with cumin seeds', price: 180, category: 'Rice & Biryani', type: 'Veg' },
  { name: 'Gulab Jamun', description: 'Soft milk dumplings soaked in rose flavored syrup', price: 120, category: 'Desserts', type: 'Veg' },
  { name: 'Rabri Falooda', description: 'Sweet vermicelli with thickened milk and nuts', price: 160, category: 'Desserts', type: 'Veg', isFeatured: true },
  { name: 'Malai Kulfi', description: 'Traditional Indian ice cream with cardamom and nuts', price: 130, category: 'Desserts', type: 'Veg' },
  { name: 'Masala Chai', description: 'Spiced Indian tea brewed to perfection', price: 60, category: 'Beverages', type: 'Veg' },
  { name: 'Fresh Lime Soda', description: 'Refreshing lime soda, sweet or salted', price: 80, category: 'Beverages', type: 'Veg' },
  { name: 'Mango Lassi', description: 'Creamy yogurt drink blended with fresh mango', price: 120, category: 'Beverages', type: 'Veg', isFeatured: true },
  { name: 'Shivam Royal Platter', description: "Chef's signature platter featuring the best of our kitchen", price: 650, category: 'Specials', type: 'Non-Veg', isFeatured: true },
];

const waTemplates = [
  { key: 'welcome', label: 'Welcome Message', message: 'Welcome to Shivam Resort & Restaurant, {{name}}! 🙏 We are delighted to serve you. Enjoy your dining experience with us.' },
  { key: 'invoice', label: 'Invoice Notification', message: 'Dear {{name}}, thank you for dining with us at Shivam Resort & Restaurant! 🍽️ Your invoice #{{invoiceNumber}} for ₹{{total}} has been generated. We hope to see you again soon!' },
  { key: 'feedback', label: 'Feedback Request', message: 'Dear {{name}}, we hope you enjoyed your meal at Shivam Resort & Restaurant! 😊 Please share your valuable feedback here: {{link}} Your opinion helps us serve you better.' },
  { key: 'retention', label: '7-Day Retention', message: 'We miss you, {{name}}! 😊 It\'s been a while since your last visit to Shivam Resort & Restaurant. Come back and enjoy our latest specials. Jodhpur Road, Ghumti, Pali.' },
  { key: 'birthday', label: 'Birthday Wish', message: 'Happy Birthday {{name}}! 🎂🎉 Wishing you a wonderful day! Enjoy {{discount}}% OFF on your next visit to Shivam Resort & Restaurant. Show this message to avail your special birthday offer!' },
  { key: 'birthday_reminder', label: 'Birthday Reminder (7 days)', message: 'Your birthday is just around the corner, {{name}}! 🎁 We have a special surprise waiting for you at Shivam Resort & Restaurant. Visit us on your special day!' },
];

const seed = async () => {
  try {
    await connectDB();

    // Admin user
    const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });
    if (!existingAdmin) {
      await User.create({ name: 'Shivam Admin', email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, role: 'admin' });
      console.log(`Admin created → ${process.env.ADMIN_EMAIL}`);
    } else { console.log('Admin already exists.'); }

    // Menu
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      await MenuItem.insertMany(menuData);
      console.log(`Seeded ${menuData.length} menu items.`);
    } else { console.log('Menu items already exist.'); }

    // Tables (10 tables)
    const tableCount = await Table.countDocuments();
    if (tableCount === 0) {
      for (let i = 1; i <= 10; i++) {
        const qr = await QRCode.toDataURL(`${FRONTEND_URL}/menu?table=${i}`);
        await Table.create({ number: i, capacity: i <= 4 ? 2 : i <= 8 ? 4 : 6, section: i <= 5 ? 'Main Hall' : 'Garden Area', qrCode: qr });
      }
      console.log('Seeded 10 tables with QR codes.');
    } else { console.log('Tables already exist.'); }

    // WhatsApp templates
    for (const tpl of waTemplates) {
      const exists = await WhatsappTemplate.findOne({ key: tpl.key });
      if (!exists) await WhatsappTemplate.create(tpl);
    }
    console.log('WhatsApp templates seeded.');

    // Birthday campaign
    const campaign = await BirthdayCampaign.findOne();
    if (!campaign) {
      await BirthdayCampaign.create({ name: 'Default Birthday Campaign', discountPercent: 10 });
      console.log('Birthday campaign created.');
    }

    console.log('\n✅ Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seed();
