import express from 'express';
import MenuItem from '../models/MenuItem.js';
import TableReservation from '../models/TableReservation.js';
import RoomReservation from '../models/RoomReservation.js';
import ContactMessage from '../models/ContactMessage.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route GET /api/dashboard/stats (admin)
router.get('/stats', protect, async (req, res, next) => {
  try {
    const [
      totalMenuItems,
      totalTableReservations,
      pendingTableReservations,
      totalRoomReservations,
      pendingRoomReservations,
      totalMessages,
      unreadMessages,
      recentTableReservations,
      recentRoomReservations,
      recentMessages,
    ] = await Promise.all([
      MenuItem.countDocuments(),
      TableReservation.countDocuments(),
      TableReservation.countDocuments({ status: 'Pending' }),
      RoomReservation.countDocuments(),
      RoomReservation.countDocuments({ status: 'Pending' }),
      ContactMessage.countDocuments(),
      ContactMessage.countDocuments({ isRead: false }),
      TableReservation.find().sort({ createdAt: -1 }).limit(5),
      RoomReservation.find().sort({ createdAt: -1 }).limit(5),
      ContactMessage.find().sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      success: true,
      data: {
        totalMenuItems,
        totalTableReservations,
        pendingTableReservations,
        totalRoomReservations,
        pendingRoomReservations,
        totalMessages,
        unreadMessages,
        recentTableReservations,
        recentRoomReservations,
        recentMessages,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
