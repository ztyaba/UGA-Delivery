import { useEffect } from 'react';
import { getSocket } from '../lib/socket.js';

export default function useSocketRoom (room, eventHandlers = {}) {
  useEffect(() => {
    if (!room) return undefined;

    const socket = getSocket();
    socket.emit('join', room);

    Object.entries(eventHandlers).forEach(([event, handler]) => {
      if (typeof handler === 'function') {
        socket.on(event, handler);
      }
    });

    return () => {
      Object.entries(eventHandlers).forEach(([event, handler]) => {
        if (typeof handler === 'function') {
          socket.off(event, handler);
        }
      });
      socket.emit('leave', room);
    };
  }, [room, eventHandlers]);
}
