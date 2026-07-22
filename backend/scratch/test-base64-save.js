import fs from 'fs';
import path from 'path';
import { saveBase64Image } from '../utils/uploadHelper.js';

const dummyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

function verify() {
  try {
    console.log('Testing saveBase64Image helper...');
    const resultPath = saveBase64Image(dummyBase64);
    console.log('Returned Path:', resultPath);

    // Verify format
    if (!resultPath.startsWith('/uploads/room-') || !resultPath.endsWith('.png')) {
      throw new Error(`Path is in wrong format: ${resultPath}`);
    }

    // Verify file exists
    const absolutePath = path.join(process.cwd(), resultPath);
    console.log('Absolute File Path:', absolutePath);
    if (!fs.existsSync(absolutePath)) {
      throw new Error(`File does not exist on disk: ${absolutePath}`);
    }

    console.log('File successfully verified on disk!');

    // Cleanup
    fs.unlinkSync(absolutePath);
    console.log('Cleaned up test image.');
    console.log('TEST PASSED.');
    process.exit(0);
  } catch (err) {
    console.error('TEST FAILED:', err.message);
    process.exit(1);
  }
}

verify();
