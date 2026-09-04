import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    socket = io(socketUrl, {
      autoConnect: true,
    });
  }
  return socket;
}


export function joinTestRoom(testId: string) {
  const s = getSocket();
  s.emit('join_test_room', testId);
}

export function leaveTestRoom(testId: string) {
  const s = getSocket();
  s.emit('leave_test_room', testId);
}
