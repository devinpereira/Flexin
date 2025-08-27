import Chat from '../models/Chat.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Text message validation utility
const validateTextMessage = (content) => {
  if (typeof content !== 'string') {
    return { isValid: false, error: 'Message must be a string' };
  }
  
  if (!content.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (content.length > 1000) {
    return { isValid: false, error: 'Message is too long (max 1000 characters)' };
  }
  
  return { isValid: true };
};

// Create a new chat or add a message to an existing chat (POST)
export const createOrAddMessage = async (req, res) => {
	try {
		const { trainerId, userId, content } = req.body;
		if (!trainerId || !userId || !content) {
			return res.status(400).json({ message: 'trainerId, userId, and content are required.' });
		}

		// Validate text message content
		const validation = validateTextMessage(content);
		if (!validation.isValid) {
			return res.status(400).json({ message: validation.error });
		}

		// Determine sender based on the authenticated user
		// You can modify this logic based on your authentication setup
		const senderId = req.user?.id || userId; // Default to userId if no authenticated user

		let chat = await Chat.findOne({ trainerId, userId });
		if (!chat) {
			chat = new Chat({
				trainerId,
				userId,
				messages: [{ sender: senderId, content: content.trim() }],
			});
		} else {
			chat.messages.push({ sender: senderId, content: content.trim() });
		}
		await chat.save();
		return res.status(201).json(chat);
	} catch (error) {
		return res.status(500).json({ message: 'Error creating or adding message', error });
	}
};

// Get chat messages between a trainer and a user (GET)
export const getChat = async (req, res) => {
	try {
		const { trainerId, userId } = req.query;
		
		if (!trainerId || !userId) {
			return res.status(400).json({ message: 'trainerId and userId are required.' });
		}
		
		let chat = await Chat.findOne({ trainerId, userId });
		if (!chat) {
			// Return empty chat structure instead of 404
			return res.status(200).json({
				trainerId,
				userId,
				messages: [],
				createdAt: new Date(),
				updatedAt: new Date()
			});
		}
		
		return res.status(200).json(chat);
	} catch (error) {
		console.error('Error in getChat:', error);
		return res.status(500).json({ message: 'Error fetching chat', error });
	}
};

// Update a specific message in a chat (PUT)
export const updateMessage = async (req, res) => {
  try {
    const { chatId, messageId, content } = req.body;
    if (!chatId || !messageId || !content) {
      return res.status(400).json({ message: 'chatId, messageId, and content are required.' });
    }

    // Validate text message content
    const validation = validateTextMessage(content);
    if (!validation.isValid) {
      return res.status(400).json({ message: validation.error });
    }

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found.' });
    }
    const message = chat.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ message: 'Message not found.' });
    }
    message.content = content.trim();
    await chat.save();
    return res.status(200).json(chat);
  } catch (error) {
    return res.status(500).json({ message: 'Error updating message', error });
  }
};

// Get all chats for a trainer (GET)
export const getTrainerChats = async (req, res) => {
  try {
    const { trainerId } = req.params;
    if (!trainerId) {
      return res.status(400).json({ message: 'trainerId is required.' });
    }
    
    const chats = await Chat.find({ trainerId })
      .populate('userId', 'fullName email profileImageUrl')
      .sort({ updatedAt: -1 });
    
    // Transform the data to include last message and user info
    const chatList = chats.map(chat => {
      const lastMessage = chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : null;
      
      // Only count unread messages from the user (not from the trainer)
      const unreadCount = chat.messages.filter(msg => {
        const senderId = msg.sender.toString();
        const userId = chat.userId._id ? chat.userId._id.toString() : chat.userId.toString();
        const isFromUser = senderId === userId;
        const isUnread = !msg.isRead;
        return isFromUser && isUnread;
      }).length;
      
      return {
        chatId: chat._id,
        user: chat.userId,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          timestamp: lastMessage.timestamp,
          sender: lastMessage.sender
        } : null,
        unreadCount: unreadCount,
        updatedAt: chat.updatedAt
      };
    });
    
    console.log('Transformed chatList:', JSON.stringify(chatList, null, 2));
    
    return res.status(200).json(chatList);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching trainer chats', error });
  }
};