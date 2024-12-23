import { handleMessage } from '../services/messageHandler.js';

export function verifyWebhook(req, res) {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_TOKEN) {
    console.log('Webhook verified successfully');
    res.status(200).send(challenge);
  } else {
    console.error('Webhook verification failed');
    res.sendStatus(403);
  }
}

export function processWebhook(req, res) {
  try {
    console.log('Received webhook payload:', JSON.stringify(req.body, null, 2));

    const { entry } = req.body;
    if (!entry || !Array.isArray(entry)) {
      console.log('Invalid webhook payload - no entry array');
      return res.sendStatus(400);
    }

    const messages = extractMessages(entry);
    console.log('Extracted messages:', messages);

    if (messages.length > 0) {
      messages.forEach(message => {
        if (message.type === 'text') {
          handleMessage({
            from: message.from,
            body: message.text.body
          });
        }
      });
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.sendStatus(500);
  }
}

function extractMessages(entry) {
  const messages = [];
  
  entry.forEach(item => {
    const changes = item.changes || [];
    changes.forEach(change => {
      if (change.value?.messages) {
        change.value.messages.forEach(msg => {
          messages.push({
            from: msg.from,
            type: msg.type,
            text: msg.text || {}
          });
        });
      }
    });
  });
  
  return messages;
}