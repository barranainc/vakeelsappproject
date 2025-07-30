//const Message = require('./models/Message'); // Adjust path as needed
const { ObjectId } = require("mongodb");
const {
  Chats,
  Users,
  Fcm_tokens,
  Notifications
} = require("../models");
const sendNotification = require("../utils/sendNotifications");
const sendBulkNotification = require("../utils/sendBulkNotifications");
const sendBulkNotificationMulti = require("../utils/sendBulkNotificationsMultiCast");
let io;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Handle joining a room
    socket.on('joinRoom', (roomId) => {
      socket.join(roomId);
      console.log(`User ${socket.id} joined room ${roomId}`);
    });

    socket.on('leaveRoom', (roomId) => {
      socket.leave(roomId);
      console.log(`User ${socket.id} left room ${roomId}`);
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ room_id, sender_id,receiver_id, message, type, type_name }) => {

      const room = io.sockets.adapter.rooms.get(room_id);
      const numClients = room ? room.size : 0;

      console.log(numClients, " Clients in the Room")

      let responseMessage = {message, sender_id,receiver_id, created_at: new Date()}
      socket.to(room_id).emit('receiveMessage', JSON.stringify(responseMessage));

       const newMessage = new Chats({ 
        room_id: room_id, 
        sender_id,
        receiver_id,
        sent_at: new Date(),
        is_seen: false,
        message });

        if (numClients > 1) {
          //newMessage.is_seen = true;
          //newMessage.seen_at = new Date();
        }
        else{
         
        }
       await newMessage.save();

       let sender = await Users.findOne({_id: new ObjectId(sender_id)})
       notiTitle = `New Message on ${type} - ${type_name} ` 
       //notiTitle = `${sender.first_name} sent you a new message`;
       notiDescription = `${sender.first_name} sent you a new message - ` + message;

       let notification = new Notifications({
         title: notiTitle,
         content: notiDescription,
         data: JSON.stringify({room_id: room_id}),
         user_id: receiver_id
       })
       await notification.save();

       let token = await Fcm_tokens.find({user_id: new ObjectId(receiver_id)})
        let tokens = [];
       for (let i = 0; i < token.length; i++) {
        const fcm = token[i];
        sendNotification(notiTitle,notiDescription,JSON.stringify({room_id: room_id}),fcm.token)
       }
      // Broadcast the message to all in the room
    
      //io.to(roomId).emit('receiveMessage', message);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

const getSocketInstance = () => {
  if (!io) {
    throw new Error('Socket.io instance is not initialized. Call initSocket first.');
  }
  return io;
};

module.exports = { initSocket, getSocketInstance };