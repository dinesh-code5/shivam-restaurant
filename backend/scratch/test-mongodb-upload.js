import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Room from '../models/Room.js';
import connectDB from '../config/db.js';

dotenv.config();

// A small base64 image
const testBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

async function testMongo() {
  try {
    await connectDB();
    console.log('Successfully connected to MongoDB.');

    // Let's try to create a test Room document
    const testRoom = new Room({
      name: 'Test Room Mongo',
      type: 'Deluxe Room',
      description: 'A test room to check base64 storage',
      price: 1500,
      capacity: 2,
      size: '200 sq ft',
      amenities: ['WiFi', 'TV'],
      images: [testBase64],
      isAvailable: true,
      roomNumber: '999',
    });

    console.log('Saving test room...');
    const saved = await testRoom.save();
    console.log('Room saved successfully in MongoDB!');
    console.log('Saved Room ID:', saved._id);
    console.log('Saved images length:', saved.images[0].length);

    // Now let's delete it so we don't clutter the database
    await Room.findByIdAndDelete(saved._id);
    console.log('Test Room cleaned up.');
    process.exit(0);
  } catch (err) {
    console.error('Failed to save to MongoDB:', err);
    process.exit(1);
  }
}

testMongo();
