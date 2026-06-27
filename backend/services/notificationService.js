import Notification from '../models/Notification.js';

export const createNotification = async (type, title, message, data = {}, targetRole = 'admin') => {
  try {
    const notif = await Notification.create({ type, title, message, data, targetRole });
    return notif;
  } catch (err) {
    console.error('Notification creation error:', err.message);
  }
};
