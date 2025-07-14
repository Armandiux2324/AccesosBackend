import dotenv from 'dotenv';
import jwtServices from './services/jwt.js';

dotenv.config();

const token = jwtServices.createScannerToken();
console.log('=== Scanner Token ===');
console.log(token);
console.log('=====================');
