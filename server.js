const PORT = 3001;

const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
  cors: { origin: '*' },
});

const { ChangeSet, Text } = require('@codemirror/state');

const UPDATES = [];
const PENDING = [];
let DOC = Text.of(['Hello, world!']);

io.on('connection', (socket) => {
  socket.on('pullUpdates', (version) => {
    if (version < UPDATES.length) {
      socket.emit('pullUpdates', UPDATES.slice(version));
    } else {
      PENDING.push((updates) => socket.emit('pullUpdates', updates));
    }
  });

  socket.on('pushUpdates', (version, updates) => {
    if (version !== UPDATES.length) {
      socket.emit('pushUpdates', false);
    } else {
      for (const update of updates) {
        const changes = ChangeSet.fromJSON(update.changes);
        UPDATES.push({
          changes,
          clientID: update.clientID
        });
        DOC = changes.apply(DOC);
      }
      socket.emit('pushUpdates', true);

      while (PENDING.length) {
        PENDING.pop()(updates)
      }
    }
  });

  socket.on('getDocument', () => {
    socket.emit('getDocument', {
      version: UPDATES.length,
      doc: DOC.toString()
    });
  });
});

app.get('/', (_, res) => {
  res.send('No content.');
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});