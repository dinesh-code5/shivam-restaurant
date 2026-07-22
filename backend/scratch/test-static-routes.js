import fs from 'fs';
import path from 'path';
import axios from 'axios';

const testFilePath = path.join(process.cwd(), 'uploads', 'test-static.txt');

async function testStatic() {
  try {
    console.log('Writing test file to uploads/test-static.txt...');
    fs.mkdirSync(path.dirname(testFilePath), { recursive: true });
    fs.writeFileSync(testFilePath, 'Static Serving Works!');

    console.log('Testing GET http://localhost:5000/uploads/test-static.txt...');
    const res1 = await axios.get('http://localhost:5000/uploads/test-static.txt');
    console.log('Result 1:', res1.data);
    if (res1.data !== 'Static Serving Works!') {
      throw new Error('Response 1 mismatch');
    }

    console.log('Testing GET http://localhost:5000/api/uploads/test-static.txt...');
    const res2 = await axios.get('http://localhost:5000/api/uploads/test-static.txt');
    console.log('Result 2:', res2.data);
    if (res2.data !== 'Static Serving Works!') {
      throw new Error('Response 2 mismatch');
    }

    console.log('Both static routes serve files correctly!');
    fs.unlinkSync(testFilePath);
    console.log('TEST PASSED.');
    process.exit(0);
  } catch (err) {
    console.error('TEST FAILED:', err.message);
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
    process.exit(1);
  }
}

testStatic();
