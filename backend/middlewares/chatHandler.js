// middlewares/chatHandler.js
const chatHandler = (io, socket) => {
  socket.on('join', (userId) => {
    console.log(`User ${userId} joined the chat`);
    socket.join(userId); // Joins room with userId as room name
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);
    io.to(data.receiverId).emit('message', data); // Emits message to receiver's room
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
};

export default chatHandler;
