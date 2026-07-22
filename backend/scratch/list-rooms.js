import dotenv from 'dotenv';
import Room from '../models/Room.js';
import connectDB from '../config/db.js';

dotenv.config();

async function listRooms() {
  try {
    await connectDB();
    const rooms = await Room.find();
    console.log(`Found ${rooms.length} rooms in DB:`);
    rooms.forEach(r => {
      console.log(`- ID: ${r._id}`);
      console.log(`  Name: ${r.name}`);
      console.log(`  Room Number: ${r.roomNumber}`);
      console.log(`  Images Count: ${r.images ? r.images.length : 0}`);
      if (r.images && r.images.length > 0) {
        console.log(`  First Image Length: ${r.images[0].length}`);
        console.log(`  First Image Snippet: ${r.images[0].substring(0, 50)}...`);
      }
    });
    process.exit(0);
  } catch (err) {
    console.error('Error listing rooms:', err);
    process.exit(1);
  }
}

listRooms();
