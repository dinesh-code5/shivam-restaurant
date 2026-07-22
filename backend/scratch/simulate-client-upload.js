import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function simulate() {
  try {
    console.log('Logging in as admin...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
    });

    const token = loginRes.data.token;
    console.log('Login successful. Token obtained.');

    // Create a ~1.5MB base64 string
    const base64Header = 'data:image/jpeg;base64,';
    const numChars = 1.5 * 1024 * 1024;
    const bodyChar = 'A';
    const largeBase64 = base64Header + bodyChar.repeat(numChars);

    console.log(`Sending POST /api/rooms/manage with base64 image of size ${largeBase64.length} chars...`);
    const roomRes = await axios.post(
      `${API_URL}/rooms/manage`,
      {
        name: 'Simulated Deluxe Room',
        type: 'Deluxe Room',
        price: '3000',
        capacity: 2,
        size: '350 sq ft',
        roomNumber: '777',
        description: 'Simulated room description',
        isAvailable: true,
        amenities: 'AC,WiFi,TV',
        image: largeBase64,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Room created successfully! Response status:', roomRes.status);
    console.log('Room data:', roomRes.data);

    // Clean up created room if possible
    if (roomRes.data.success && roomRes.data.data._id) {
      const roomId = roomRes.data.data._id;
      console.log(`Cleaning up: deleting room ${roomId}...`);
      await axios.delete(`${API_URL}/rooms/manage/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Room cleaned up.');
    }
  } catch (err) {
    console.error('Simulation failed:');
    if (err.response) {
      console.error('Response status:', err.response.status);
      console.error('Response headers:', err.response.headers);
      console.error('Response data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

simulate();
