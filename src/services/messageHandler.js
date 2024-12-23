import { lecturers } from '../config/lecturers.js';
import { sendMessage } from './whatsapp.js';
import { logLecturerResponse } from './logger.js';

const pendingConfirmations = new Map();

export async function handleMessage(data) {
  const { from, body } = data;
  
  if (pendingConfirmations.has(from)) {
    const response = body.toLowerCase();
    const lecturer = lecturers[from];

    if (response === 'yes' || response === 'no') {
      // Log the response
      logLecturerResponse(lecturer, response);
      
      const status = response === 'yes' ? 'confirmed' : 'cancelled';
      await sendMessage(from, `Thank you, ${lecturer.name}. Your class has been ${status}.`);
      pendingConfirmations.delete(from);
    } else {
      await sendMessage(from, 'Please respond with either "yes" or "no".');
    }
  }
}

export async function sendClassConfirmations() {
  for (const [number, lecturer] of Object.entries(lecturers)) {
    const message = `Hello ${lecturer.name}, please confirm if you will be taking your ${lecturer.subject} class today?\n\nReply with "yes" or "no".`;
    const sent = await sendMessage(number, message);
    
    if (sent) {
      pendingConfirmations.set(number, true);
      console.log(`Confirmation request sent to ${lecturer.name}`);
    }
  }
}