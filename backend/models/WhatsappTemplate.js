import mongoose from 'mongoose';

const whatsappTemplateSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  message: { type: String, required: true },
  isEnabled: { type: Boolean, default: true },
  // Variables: {{name}}, {{invoice}}, {{offer}}, {{link}}
}, { timestamps: true });

export default mongoose.model('WhatsappTemplate', whatsappTemplateSchema);
