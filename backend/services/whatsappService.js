// WhatsApp Service — uses WhatsApp Business API via wa.me links
// For real integration, replace with Twilio / Interakt / WATI SDK calls
// This module logs messages and generates wa.me links as fallback

import WhatsappTemplate from '../models/WhatsappTemplate.js';
import Customer from '../models/Customer.js';

const BASE_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const WA_API_URL = process.env.WA_API_URL || ''; // e.g. https://api.interakt.ai/...
const WA_API_KEY = process.env.WA_API_KEY || '';

// Substitute template variables
const renderMessage = (template, vars = {}) => {
  let msg = template;
  Object.entries(vars).forEach(([key, val]) => {
    msg = msg.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });
  return msg;
};

// Core send function — logs and optionally calls API
const sendWhatsApp = async (phone, message) => {
  const cleaned = phone.replace(/\D/g, '');
  const number = cleaned.length === 10 ? `91${cleaned}` : cleaned;

  console.log(`[WhatsApp] → +${number}: ${message.slice(0, 80)}...`);

  if (WA_API_URL && WA_API_KEY) {
    try {
      // Replace with your provider's API format
      const response = await fetch(WA_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${WA_API_KEY}` },
        body: JSON.stringify({ to: number, type: 'text', text: { body: message } }),
      });
      const data = await response.json();
      console.log('[WhatsApp] API response:', data);
      return { success: true, data };
    } catch (err) {
      console.error('[WhatsApp] API error:', err.message);
    }
  }

  // Fallback: return wa.me link
  return {
    success: true,
    fallback: true,
    link: `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
  };
};

// ─── Template Shortcuts ────────────────────────────────────────────────────

export const sendWelcome = async (phone, name) => {
  const tpl = await WhatsappTemplate.findOne({ key: 'welcome', isEnabled: true });
  if (!tpl) return;
  const msg = renderMessage(tpl.message, { name });
  return sendWhatsApp(phone, msg);
};

export const sendInvoiceNotification = async (phone, name, invoiceNumber, total) => {
  const tpl = await WhatsappTemplate.findOne({ key: 'invoice', isEnabled: true });
  if (!tpl) return;
  const msg = renderMessage(tpl.message, { name, invoiceNumber, total });
  return sendWhatsApp(phone, msg);
};

export const sendFeedbackRequest = async (phone, name, token) => {
  const tpl = await WhatsappTemplate.findOne({ key: 'feedback', isEnabled: true });
  if (!tpl) return;
  const link = `${BASE_URL}/feedback/${token}`;
  const msg = renderMessage(tpl.message, { name, link });
  return sendWhatsApp(phone, msg);
};

export const sendRetentionMessage = async (phone, name) => {
  const tpl = await WhatsappTemplate.findOne({ key: 'retention', isEnabled: true });
  if (!tpl) return;
  const msg = renderMessage(tpl.message, { name });
  return sendWhatsApp(phone, msg);
};

export const sendBirthdayWish = async (phone, name, discount) => {
  const tpl = await WhatsappTemplate.findOne({ key: 'birthday', isEnabled: true });
  if (!tpl) return;
  const msg = renderMessage(tpl.message, { name, discount });
  return sendWhatsApp(phone, msg);
};

export const sendBirthdayReminder = async (phone, name) => {
  const tpl = await WhatsappTemplate.findOne({ key: 'birthday_reminder', isEnabled: true });
  if (!tpl) return;
  const msg = renderMessage(tpl.message, { name });
  return sendWhatsApp(phone, msg);
};
