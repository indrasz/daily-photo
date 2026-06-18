import { io } from 'socket.io-client';
import type { Socket } from 'socket.io-client';

let _socket: Socket | null = null;

export function getSocket(): Socket {
  if (!_socket) {
    _socket = io(
      process.env.NEXT_PUBLIC_BACKEND_URL!,
      { autoConnect: false }
    );
  }
  return _socket;
}
