export enum MessageType {
    TEXT = 'text',
    IMAGE = 'image',
    FILE = 'file',
    SYSTEM = 'system',
}

// Base interface for a chat message
export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    content: string;
    contentType: MessageType;
    createdAt: Date;
    updatedAt?: Date;
    readBy?: string[];
    metadata?: Record<string, any>;
}

// Interface for creating a new message
export interface CreateChatMessageDto {
    roomId: string;
    senderId: string;
    content: string;
    contentType: MessageType;
    metadata?: Record<string, any>;
}

// Interface for room information
export interface ChatRoom {
    id: string;
    name: string;
    description?: string;
    isPrivate: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt?: Date;
    participants: string[];
    lastMessage?: ChatMessage;
    metadata?: Record<string, any>;
}

// Interface for creating a new room
export interface CreateRoomDto {
    name: string;
    description?: string;
    isPrivate: boolean;
    participants: string[];
    metadata?: Record<string, any>;
}

// Interface for typing status events
export interface TypingStatus {
    roomId: string;
    userId: string;
    isTyping: boolean;
    timestamp: Date;
}

// Interface for tracking read receipts
export interface ReadReceipt {
    messageId: string;
    roomId: string;
    userId: string;
    readAt: Date;
}

// Socket.IO events enum
export enum ChatSocketEvent {
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    JOIN_ROOM = 'joinRoom',
    LEAVE_ROOM = 'leaveRoom',
    SEND_MESSAGE = 'sendMessage',
    NEW_MESSAGE = 'newMessage',
    START_TYPING = 'startTyping',
    STOP_TYPING = 'stopTyping',
    TYPING_STATUS = 'typingStatus',
    READ_MESSAGE = 'readMessage',
    READ_RECEIPT = 'readReceipt',
}

// Kafka topics for chat-related events
export enum ChatKafkaTopic {
    MESSAGE_CREATED = 'chat-message-created-event',
    MESSAGE_UPDATED = 'chat-message-updated',
    MESSAGE_DELETED = 'chat-message-deleted',
    ROOM_CREATED = 'chat-room-created',
    ROOM_UPDATED = 'chat-room-updated',
    MESSAGE_READ = 'chat-message-read',
}

export interface KafkaSendMessage {
    topic: ChatKafkaTopic;
    message: {
        key: string;
        value: string;
        headers?: Record<string, string>;
        timestamp?: Date;
    };
    partition?: number;
    offset?: number;
}