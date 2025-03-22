import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat } from "../entity/chat.entity";
import { Model } from "mongoose";


@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

    async createChat(chat: Chat): Promise<Chat> {
        try{
            const { sender, receiver, message } = chat;
            const newChat = await new this.chatModel({ sender, receiver, message });
            const saveChat = await newChat.save();
            return saveChat;
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findAllChats(): Promise<Chat[]> {
        try {
            const getChats = await this.chatModel.find().exec();
            return getChats;
        }  
        catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findChatsBySender(sender: string): Promise<Chat[]> {
        try {
            const findChat = this.chatModel.find({ sender }).exec();
            return findChat;
        }  catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findChatsByReceiver(receiver: string): Promise<Chat[]> {
        try{
            const findChat = this.chatModel.find({ receiver }).exec();
            return findChat;
        }
        catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}