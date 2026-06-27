import mongoose from 'mongoose';

const roomReservationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    roomType: {
      type: String,
      required: true,
      enum: ['Deluxe Room', 'Premium Suite', 'Family Room', 'Banquet Hall'],
    },
    guests: { type: Number, required: true, min: 1, max: 20 },
    specialRequest: { type: String, default: '' },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

export default mongoose.model('RoomReservation', roomReservationSchema);
