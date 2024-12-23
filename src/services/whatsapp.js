import axios from 'axios';
import { config } from '../config/whatsapp.js';

const client = axios.create({
  baseURL: `${config.baseUrl}/${config.apiVersion}/${config.phoneNumberId}`,
  headers: {
    'Authorization': `Bearer ${config.apiToken}`,
    'Content-Type': 'application/json'
  }
});

export async function sendMessage(to, message) {
  try {
    await client.post('/messages', {
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body: message }
    });
    return true;
  } catch (error) {
    console.error('Failed to send message:', error.response?.data || error.message);
    return false;
  }
}