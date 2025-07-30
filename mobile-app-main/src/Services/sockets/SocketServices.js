// SocketService.js
import io from 'socket.io-client';
import { enviroment } from '../../environment';

class SocketService {
  constructor() {
    this.socket = null;
  }

  connect() {
    this.socket = io(enviroment?.API_URL, {
      transports: ['websocket'],  // Optional: Force WebSocket transport
      reconnectionAttempts: 5,    // Optional: Max reconnection attempts
      timeout: 10000,             // Optional: Connection timeout
    });

    // Event listeners
    // this.socket.on('connect', () => {
    //   console.log('Connected to socket server');
    // });

    // this.socket.on('disconnect', () => {
    //   console.log('Disconnected from socket server');
    // });

    this.socket.on('receiveMessage', (data) => {
      console.log('Message received:', data);
    });
  }
  sendMessage(event, message) {
    if (this.socket) {
      this.socket.emit(event, message);
    }
  }
  offSocket() {
    if (this.socket) {
      this.socket.off('receiveMessage');
    }
  }
  emit(id) {
    if (this.socket) {
      this.socket.emit('joinRoom', id);
    }
  }
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export default new SocketService();