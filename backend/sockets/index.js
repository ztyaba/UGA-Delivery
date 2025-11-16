const { Server } = require('socket.io');

let io;

function initSocket (server) {
  io = new Server(server, {
    cors: {
      origin: '*'
    }
  });

  io.on('connection', (socket) => {
    socket.on('join', (room) => {
      if (typeof room === 'string' && room.trim().length > 0) {
        socket.join(room.trim());
      }
    });

    socket.on('leave', (room) => {
      if (typeof room === 'string' && room.trim().length > 0) {
        socket.leave(room.trim());
      }
    });
  });

  return io;
}

function getIO () {
  if (!io) {
    throw new Error('Socket.io is not initialized');
  }
  return io;
}

function emitToRoom (room, event, payload) {
  try {
    const instance = getIO();
    instance.to(room).emit(event, payload);
  } catch (error) {
    console.error('Socket emit error:', error.message); // eslint-disable-line no-console
  }
}

module.exports = {
  initSocket,
  getIO,
  emitToRoom
};
