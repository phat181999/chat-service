import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat } from "../entity/chat.entity";
import { Model } from "mongoose";


@Injectable()
export class ChatService {
    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {}

    async createChat(sender: string, receiver: string, message: string): Promise<Chat> {
        const newChat = new this.chatModel({ sender, receiver, message });
        return newChat.save();
    }

    async findAllChats(): Promise<Chat[]> {
        return this.chatModel.find().exec();
    }

    async findChatsBySender(sender: string): Promise<Chat[]> {
        return this.chatModel.find({ sender }).exec();
    }

    async findChatsByReceiver(receiver: string): Promise<Chat[]> {
        return this.chatModel.find({ receiver }).exec();
    }
}