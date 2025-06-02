const socketIo = require('socket.io');
const Message = require('../models/Message');

class SocketConfig {
    static init(server) {
        const io = socketIo(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        io.on('connection', (socket) => {
            console.log('👤 User connected:', socket.id);
            
            // Join user to their room
            socket.on('join-room', (userId) => {
                socket.join(userId);
                console.log(`👤 User ${userId} joined room`);
            });
            
            // Handle message sending
            socket.on('send-message', async (data) => {
                try {
                    console.log(`📨 Processing message from ${data.senderId} to ${data.receiverId}`);
                    console.log(`📝 Message content: "${data.content}"`);
                    
                    const message = new Message({
                        sender: data.senderId,
                        receiver: data.receiverId,
                        content: data.content,
                        messageType: data.messageType || 'text',
                        fileUrl: data.fileUrl || null,
                        fileName: data.fileName || null
                    });
                    
                    await message.save();
                    await message.populate('sender receiver', 'name');
                    
                    console.log(`💾 Message saved to DB with ID: ${message._id}`);
                    
                    // Send to receiver's room
                    console.log(`📤 Sending message to receiver room: ${data.receiverId}`);
                    io.to(data.receiverId).emit('receive-message', message);
                    
                    // Send to all connected sockets in receiver's room (debug)
                    const receiverSockets = await io.in(data.receiverId).fetchSockets();
                    console.log(`🔌 Found ${receiverSockets.length} sockets in receiver room ${data.receiverId}`);
                    
                    // Confirm to sender
                    console.log(`✅ Confirming message sent to sender: ${data.senderId}`);
                    socket.emit('message-sent', message);
                    
                    console.log(`💬 Message sent from ${data.senderId} to ${data.receiverId}`);
                } catch (error) {
                    console.error('❌ Message error:', error);
                    socket.emit('message-error', 'Failed to send message');
                }
            });

            // Handle typing indicators
            socket.on('typing-start', (data) => {
                socket.to(data.receiverId).emit('user-typing', {
                    userId: data.senderId,
                    userName: data.senderName
                });
            });

            socket.on('typing-stop', (data) => {
                socket.to(data.receiverId).emit('user-stopped-typing', {
                    userId: data.senderId
                });
            });
            
            // Handle disconnection
            socket.on('disconnect', () => {
                console.log('👤 User disconnected:', socket.id);
            });
        });

        return io;
    }
}

module.exports = SocketConfig; 