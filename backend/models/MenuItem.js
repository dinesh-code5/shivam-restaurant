import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        'Starters',
        'Soups',
        'Main Course',
        'Breads',
        'Rice & Biryani',
        'Desserts',
        'Beverages',
        'Specials',
      ],
    },
    type: { type: String, enum: ['Veg', 'Non-Veg', 'Vegan'], default: 'Veg' },
    image: { type: String, default: '' },
    isAvailable: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);
