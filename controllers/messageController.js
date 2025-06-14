const Message = require('../models/Message');
const userService = require('../services/userService');
const appointmentService = require('../services/appointmentService');
const Appointment = require('../models/Appointment');
const mongoose = require('mongoose');

class MessageController {
    // Display chat page with a specific user
    static async getChatPage(req, res) {
        try {
            const currentUserId = req.session.user.id;
            const otherUserId = req.params.userId;
            
            // Check if psychologist is approved
            if (req.session.user.role === 'psychologist' && req.session.user.isApproved === false) {
                req.flash('error', 'Hesabınız henüz onaylanmadığı için mesajlaşma özelliğini kullanamıyorsunuz. Onay aldıktan sonra tekrar deneyiniz.');
                return res.redirect('/dashboard');
            }
            
            // Verify users can communicate (have appointments together)
            const canCommunicate = await MessageController.canUsersCommunicate(
                currentUserId, 
                otherUserId
            );
            
            if (!canCommunicate) {
                req.flash('error', 'Bu kullanıcıyla mesajlaşma yetkiniz yok');
                return res.redirect('/dashboard');
            }
            
            // Get the other user details
            const otherUser = await userService.getUserById(otherUserId);
            if (!otherUser) {
                req.flash('error', 'Kullanıcı bulunamadı');
                return res.redirect('/dashboard');
            }
            
            // Apply privacy settings if current user is psychologist and other user is patient
            if (req.session.user.role === 'psychologist' && otherUser.role === 'patient') {
                if (otherUser.shareNameWithPsychologist === false) {
                    otherUser.name = `Anonim Hasta #${otherUser._id.toString().slice(-6)}`;
                    otherUser.email = `anonim.hasta.${otherUser._id.toString().slice(-6)}@gizli.com`;
                }
            }
            
            // Get conversation history
            const messages = await MessageController.getConversationHistory(
                currentUserId, 
                otherUserId
            );
            
            res.render('chat/conversation', {
                otherUser: otherUser,
                messages: messages,
                currentUserId: currentUserId
            });
        } catch (error) {
            console.error('Get chat page error:', error);
            req.flash('error', 'Sohbet sayfası yüklenirken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Get messages list page
    static async getMessagesPage(req, res) {
        try {
            const userId = req.session.user.id;
            
            // Get all conversations for the user
            const conversations = await MessageController.getUserConversations(userId);
            
            res.render('chat/messages', {
                conversations: conversations
            });
        } catch (error) {
            console.error('Get messages page error:', error);
            req.flash('error', 'Mesajlar sayfası yüklenirken bir hata oluştu');
            res.redirect('/dashboard');
        }
    }

    // Get conversation history between two users
    static async getConversationHistory(userId1, userId2, limit = 50) {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: userId1, receiver: userId2 },
                    { sender: userId2, receiver: userId1 }
                ]
            })
            .populate('sender receiver', 'name role shareNameWithPsychologist')
            .sort({ createdAt: 1 })
            .limit(limit)
            .exec();
            
            // Apply privacy settings
            return messages.map(message => {
                // If sender is patient and receiver is psychologist, check privacy
                if (message.sender.role === 'patient' && message.receiver.role === 'psychologist') {
                    if (message.sender.shareNameWithPsychologist === false) {
                        message.sender.name = `Anonim Hasta #${message.sender._id.toString().slice(-6)}`;
                        message.sender.email = `anonim.hasta.${message.sender._id.toString().slice(-6)}@gizli.com`;
                    }
                }
                // If receiver is patient and sender is psychologist, check privacy
                if (message.receiver.role === 'patient' && message.sender.role === 'psychologist') {
                    if (message.receiver.shareNameWithPsychologist === false) {
                        message.receiver.name = `Anonim Hasta #${message.receiver._id.toString().slice(-6)}`;
                        message.receiver.email = `anonim.hasta.${message.receiver._id.toString().slice(-6)}@gizli.com`;
                    }
                }
                return message;
            });
        } catch (error) {
            console.error('Get conversation history error:', error);
            return [];
        }
    }

    // Get all conversations for a user
    static async getUserConversations(userId) {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            
            const conversations = await Message.aggregate([
                {
                    $match: {
                        $or: [
                            { sender: userObjectId },
                            { receiver: userObjectId }
                        ]
                    }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $group: {
                        _id: {
                            $cond: [
                                { $eq: ["$sender", userObjectId] },
                                "$receiver",
                                "$sender"
                            ]
                        },
                        lastMessage: { $first: "$$ROOT" },
                        unreadCount: {
                            $sum: {
                                $cond: [
                                    {
                                        $and: [
                                            { $eq: ["$receiver", userObjectId] },
                                            { $eq: ["$isRead", false] }
                                        ]
                                    },
                                    1,
                                    0
                                ]
                            }
                        }
                    }
                }
            ]);

            // Populate user details
            await Message.populate(conversations, [
                { path: '_id', select: 'name role email shareNameWithPsychologist' },
                { path: 'lastMessage.sender', select: 'name email role shareNameWithPsychologist' },
                { path: 'lastMessage.receiver', select: 'name email role shareNameWithPsychologist' }
            ]);
            
            // Apply privacy settings to conversations
            conversations.forEach(conversation => {
                // Check if the other user is a patient and current user is psychologist
                if (conversation._id && conversation._id.role === 'patient' && 
                    conversation._id.shareNameWithPsychologist === false) {
                    conversation._id.name = `Anonim Hasta #${conversation._id._id.toString().slice(-6)}`;
                    conversation._id.email = `anonim.hasta.${conversation._id._id.toString().slice(-6)}@gizli.com`;
                }
                
                // Apply privacy to last message sender/receiver
                if (conversation.lastMessage) {
                    if (conversation.lastMessage.sender && 
                        conversation.lastMessage.sender.role === 'patient' && 
                        conversation.lastMessage.sender.shareNameWithPsychologist === false) {
                        conversation.lastMessage.sender.name = `Anonim Hasta #${conversation.lastMessage.sender._id.toString().slice(-6)}`;
                        conversation.lastMessage.sender.email = `anonim.hasta.${conversation.lastMessage.sender._id.toString().slice(-6)}@gizli.com`;
                    }
                    
                    if (conversation.lastMessage.receiver && 
                        conversation.lastMessage.receiver.role === 'patient' && 
                        conversation.lastMessage.receiver.shareNameWithPsychologist === false) {
                        conversation.lastMessage.receiver.name = `Anonim Hasta #${conversation.lastMessage.receiver._id.toString().slice(-6)}`;
                        conversation.lastMessage.receiver.email = `anonim.hasta.${conversation.lastMessage.receiver._id.toString().slice(-6)}@gizli.com`;
                    }
                }
            });

            return conversations;
        } catch (error) {
            console.error('Get user conversations error:', error);
            return [];
        }
    }

    // Check if two users can communicate (have appointments together)
    static async canUsersCommunicate(userId1, userId2) {
        try {
            // Check if there are any appointments between these users
            const hasAppointments = await Appointment.exists({
                $or: [
                    { patient: userId1, psychologist: userId2 },
                    { patient: userId2, psychologist: userId1 }
                ]
            });

            return !!hasAppointments;
        } catch (error) {
            console.error('Can users communicate check error:', error);
            return false;
        }
    }

    // Mark messages as read
    static async markMessagesAsRead(req, res) {
        try {
            const currentUserId = req.session.user.id;
            const otherUserId = req.params.userId;

            await Message.updateMany(
                {
                    sender: otherUserId,
                    receiver: currentUserId,
                    isRead: false
                },
                { isRead: true }
            );

            res.json({ success: true });
        } catch (error) {
            console.error('Mark messages as read error:', error);
            res.status(500).json({ error: 'Mesajlar okundu olarak işaretlenirken bir hata oluştu' });
        }
    }

    // Get unread message count
    static async getUnreadCount(req, res) {
        try {
            const userId = req.session.user.id;

            const unreadCount = await Message.countDocuments({
                receiver: userId,
                isRead: false
            });

            res.json({ unreadCount });
        } catch (error) {
            console.error('Get unread count error:', error);
            res.status(500).json({ error: 'Okunmamış mesaj sayısı alınırken bir hata oluştu' });
        }
    }

    // Send message (used by Socket.io, but can also be used via HTTP)
    static async sendMessage(req, res) {
        try {
            const senderId = req.session.user.id;
            const { receiverId, content, messageType = 'text' } = req.body;

            // Verify users can communicate
            const canCommunicate = await MessageController.canUsersCommunicate(senderId, receiverId);
            if (!canCommunicate) {
                return res.status(403).json({ error: 'Bu kullanıcıyla mesajlaşma yetkiniz yok' });
            }

            const message = new Message({
                sender: senderId,
                receiver: receiverId,
                content,
                messageType
            });

            await message.save();
            await message.populate('sender receiver', 'name');

            res.json(message);
        } catch (error) {
            console.error('Send message error:', error);
            res.status(500).json({ error: 'Mesaj gönderilirken bir hata oluştu' });
        }
    }
}

module.exports = MessageController; 