import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat } from "../entity/chat.entity";
import { Model } from "mongoose";
import { KafkaService } from "src/shared/service/kafka.service";

@Injectable()
export class ChatService  {

    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        private kafkaService: KafkaService
    ) {
    }

    async createChat(chat: Chat): Promise<Chat> {
        try {
            const {sender, receiver, message} = chat;
            await this.kafkaService.checkAndWaitForUserExists(receiver);
            const newChat = new this.chatModel(chat);
            return await newChat.save();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findAllChats(): Promise<Chat[]> {
        try {
            return await this.chatModel.find().exec();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findChatsBySender(sender: string): Promise<Chat[]> {
        try {
            return await this.chatModel.find({ sender }).exec();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findChatsByReceiver(receiver: string): Promise<Chat[]> {
        try {
            return await this.chatModel.find({ receiver }).exec();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
