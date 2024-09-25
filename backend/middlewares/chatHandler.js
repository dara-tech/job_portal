// socketHandlers/chatHandler.js

const chatHandler = (io, socket) => {
    socket.on('join', (userId) => {
      console.log(`User ${userId} joined the chat`);
      socket.join(userId);
    });
  
    socket.on('message', (data) => {
      console.log('Message received:', data);
      io.to(data.receiverId).emit('message', data);
    });
  
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  };
  
  export default chatHandler;