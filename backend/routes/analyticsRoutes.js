import express from 'express';
import Invoice from '../models/Invoice.js';
import Customer from '../models/Customer.js';
import Feedback from '../models/Feedback.js';
import TableSession from '../models/TableSession.js';
import RoomReservation from '../models/RoomReservation.js';
import MenuItem from '../models/MenuItem.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, async (req, res, next) => {
  try {
    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
    const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);

    const [
      todayInvoices,
      weekInvoices,
      monthInvoices,
      totalCustomers,
      returningCustomers,
      avgRatingAgg,
      allSessions,
      roomBookings,
    ] = await Promise.all([
      Invoice.find({ createdAt: { $gte: todayStart } }),
      Invoice.find({ createdAt: { $gte: weekStart } }),
      Invoice.find({ createdAt: { $gte: monthStart } }),
      Customer.countDocuments(),
      Customer.countDocuments({ visitCount: { $gt: 1 } }),
      Feedback.aggregate([{ $match: { status: 'approved', rating: { $gt: 0 } } }, { $group: { _id: null, avg: { $avg: '$rating' } } }]),
      TableSession.find({ status: 'billed' }).select('orders'),
      RoomReservation.countDocuments({ status: { $in: ['Confirmed', 'Completed'] } }),
    ]);

    // Revenue sums
    const sumRevenue = (arr) => arr.reduce((s, inv) => s + (inv.total || 0), 0);

    // Most ordered items
    const itemCounts = {};
    allSessions.forEach((s) => {
      s.orders.forEach((o) => {
        itemCounts[o.name] = (itemCounts[o.name] || 0) + o.quantity;
      });
    });
    const mostOrdered = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    res.json({
      success: true,
      data: {
        revenue: {
          today: sumRevenue(todayInvoices),
          week: sumRevenue(weekInvoices),
          month: sumRevenue(monthInvoices),
        },
        customers: {
          total: totalCustomers,
          returning: returningCustomers,
          newToday: todayInvoices.length,
        },
        avgRating: avgRatingAgg[0]?.avg?.toFixed(1) || '0.0',
        mostOrdered,
        roomBookings,
        occupancyRate: totalCustomers > 0 ? Math.min(Math.round((returningCustomers / totalCustomers) * 100), 100) : 0,
      },
    });
  } catch (err) { next(err); }
});

export default router;
