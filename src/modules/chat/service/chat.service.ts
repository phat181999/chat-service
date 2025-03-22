import { HttpException, HttpStatus, Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat } from "../entity/chat.entity";
import { Model } from "mongoose";
import { Kafka, Admin, Producer, Consumer } from "kafkajs";

@Injectable()
export class ChatService implements OnModuleInit, OnModuleDestroy {
    private kafka: Kafka;
    private producer: Producer;
    private admin: Admin;
    private consumers: Set<Consumer> = new Set();

    constructor(@InjectModel(Chat.name) private chatModel: Model<Chat>) {
        this.kafka = new Kafka({ brokers: ['localhost:9092'] });
        this.producer = this.kafka.producer();
        this.admin = this.kafka.admin();
    }

    async onModuleInit() {
        await this.producer.connect();
        await this.admin.connect();
    }

    async checkUserExists(userId: string) {
        await this.producer.send({
          topic: 'check-user-exists',
          messages: [{ value: JSON.stringify({ userId }) }],
        });
        console.log(`📩 Sent request to check user: ${userId}`);
    }
    
    async createChat(chat: Chat): Promise<Chat> {
        try {
            const {sender, receiver, message} = chat;
            await this.checkUserExists(sender);
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

    async onModuleDestroy() {
        await this.producer.disconnect();
        await this.admin.disconnect();
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
}
