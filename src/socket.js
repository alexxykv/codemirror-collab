import { io } from 'socket.io-client';
import { ChangeSet } from '@codemirror/state';

export const URL = 'ws://localhost:3001';

export const socket = io(URL, {
  autoConnect: false,
  extraHeaders: {
    'ngrok-skip-browser-warning': true
  },
  transports: ['websocket'],
});

export const getDocument = () => {
  socket.emit('getDocument');

  return new Promise((resolve, _) => {
    socket.on('getDocument', document => {
      resolve(document);
    });
  });
}

export const pullUpdates = (version) => {
  socket.emit('pullUpdates', version);

  return new Promise((resolve, _) => {
    socket.on('pullUpdates', updates => {
      resolve(updates.map(u => {
        return {
          changes: ChangeSet.fromJSON(u.changes),
          clientID: u.clientID
        }
      }));
    });
  });
}

export const pushUpdates = (version, fullUpdates) => {
  const updates = fullUpdates.map(u => ({
    clientID: u.clientID,
    changes: u.changes.toJSON()
  }));

  socket.emit('pushUpdates', version, updates);

  return new Promise((resolve, _) => {
    socket.on('pushUpdates', success => {
      resolve(success);
    });
  });
}