import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/error.js';

// Existing routes
import authRoutes from './routes/authRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import tableReservationRoutes from './routes/tableReservationRoutes.js';
import roomReservationRoutes from './routes/roomReservationRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

// New routes
import tableRoutes from './routes/tableRoutes.js';
import kotRoutes from './routes/kotRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import feedbackRoutes from './routes/feedbackRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import whatsappRoutes from './routes/whatsappRoutes.js';
import roomManageRoutes from './routes/roomManageRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';

// Cron services
import Customer from './models/Customer.js';
import BirthdayCampaign from './models/BirthdayCampaign.js';
import {
  sendRetentionMessage, sendBirthdayWish, sendBirthdayReminder
} from './services/whatsappService.js';

connectDB();

const app = express();

app.use(cors({
      origin: ['https://shivam-resort-restaurant.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
      credentials: true
    }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));
app.use((req, res, next) => {
  console.log(`DEBUG: Incoming request: ${req.method} ${req.originalUrl}`);
  console.log(`DEBUG: Content-Type header: ${req.headers['content-type']}`);
  next();
});
// Health
app.get('/api/health', (req, res) => res.json({ success: true, message: 'Shivam API v2 running' }));

// Existing
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/reservations/table', tableReservationRoutes);
app.use('/api/reservations/room', roomReservationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/dashboard', dashboardRoutes);

// New
app.use('/api/tables', tableRoutes);
app.use('/api/kot', kotRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/rooms', roomManageRoutes);
app.use('/api/analytics', analyticsRoutes);

// ── CRON JOBS ─────────────────────────────────────────────────────────────

import TableReservation from './models/TableReservation.js';
import RoomReservation from './models/RoomReservation.js';

// ... (existing cron code)

// Daily 1 AM — Expire past reservations
cron.schedule('0 1 * * *', async () => {
  console.log('[CRON] Running reservation expiration...');
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // Mark old table reservations
    await TableReservation.updateMany(
      { date: { $lt: today }, status: { $in: ['Pending', 'Confirmed'] } },
      { $set: { status: 'Completed' } }
    );
    
    // Mark old room reservations
    await RoomReservation.updateMany(
      { checkIn: { $lt: today }, status: { $in: ['Pending', 'Confirmed'] } },
      { $set: { status: 'Completed' } }
    );
    
    console.log('[CRON] Reservation expiration complete.');
  } catch (err) {
    console.error('[CRON] Expiration error:', err.message);
  }
});
  console.log('[CRON] Running daily WhatsApp automation...');
try {
  const today = new Date();
  const todayMD = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const in7Days = new Date(today); in7Days.setDate(today.getDate() + 7);
  const in7MD = `${String(in7Days.getMonth() + 1).padStart(2, '0')}-${String(in7Days.getDate()).padStart(2, '0')}`;

  const campaign = await BirthdayCampaign.findOne({ isEnabled: true });
  const customers = await Customer.find({ phone: { $ne: '' } });

  for (const c of customers) {
    if (!c.dob) continue;
    const dobParts = c.dob.split('-'); // YYYY-MM-DD or DD-MM-YYYY
    let md = '';
    if (dobParts.length === 3) {
      md = dobParts.length > 0 && dobParts[0].length === 4
        ? `${dobParts[1]}-${dobParts[2]}`   // YYYY-MM-DD
        : `${dobParts[1]}-${dobParts[0]}`;   // DD-MM-YYYY
    }

    if (md === todayMD && campaign) {
      await sendBirthdayWish(c.phone, c.name, campaign.discountPercent);
    } else if (md === in7MD && campaign) {
      await sendBirthdayReminder(c.phone, c.name);
    }
  }

  // 7-day retention
  const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(today.getDate() - 7);
  const lapsedCustomers = await Customer.find({
    lastVisit: { $lte: sevenDaysAgo },
    $or: [
      { lastRetentionSent: null },
      { lastRetentionSent: { $lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
    ]
  });

  for (const c of lapsedCustomers) {
    await sendRetentionMessage(c.phone, c.name);
    c.lastRetentionSent = new Date();
    await c.save();
  }
    console.log(`[CRON] Done. Birthday checks: ${customers.length}, Retention: ${lapsedCustomers.length}`);
  } catch (err) {
    console.error('[CRON] Error:', err.message);
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Shivam API v2 running on port ${PORT}`));
