const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Hardcoded users
const users = {
  'user1': 'password1',
  'user2': 'password2'
};

// In-memory message store
const messages = [];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (users[username] && users[username] === password) {
    res.status(200).send({ success: true });
  } else {
    res.status(401).send({ success: false, message: 'Invalid username or password' });
  }
});

wss.on('connection', (ws) => {
  console.log('Client connected');

  // Send message history to the newly connected client
  ws.send(JSON.stringify({ type: 'history', messages }));

  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    if (parsedMessage.type === 'message') {
      // Store the message with the username
      const messageWithUser = { username: parsedMessage.username, text: parsedMessage.text };
      messages.push(messageWithUser);

      // Broadcast the message to all clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'message', ...messageWithUser }));
        }
      });
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});