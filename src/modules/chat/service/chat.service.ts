import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat } from "../entity/chat.entity";
import { Model } from "mongoose";
import { KafkaService } from "src/modules/kafka/service/kafka.service";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TcpService } from "src/shared/module/tcp/service/tcp.service";
import { ChatKafkaTopic } from "src/shared/interface/kafka";
import { CreateMessageDto, CreateMessageResponseDto } from "../dto/chat-message.dto";

@Injectable()
export class ChatService  {
    private logger: Logger;
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private tcpService: TcpService,
        private readonly kafkaService: KafkaService,
    ) {
        this.logger = new Logger(ChatService.name);
    }

    async createChat(chat: CreateMessageDto): Promise<CreateMessageResponseDto | null> {
        try {
            const { sender, receiver, message, fileUrls, senderName  } = chat;
            const cachedUser = await this.cacheManager.get(`user:${receiver}`);
            if (cachedUser === 'exists') {
                this.logger.log(`User ${receiver} exists in cache`);
                const newChat = new this.chatModel({
                    sender,
                    receiver,
                    message,
                    fileUrls, 
                    timestamp: new Date(),  
                });
                return await newChat.save();
            }
        
            const checkUser = await this.tcpService.checkUser(receiver);
            if(!checkUser) {
                throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
            }
            const newChat = await new this.chatModel(chat);
            const valueEmitToNoti = {senderName, receiver, message, timestamp: new Date()};
            await this.kafkaService.sendMessage({
                topic: ChatKafkaTopic.MESSAGE_CREATED,
                message: {
                  key: senderName ?? 'unknown_sender',
                  value: JSON.stringify(valueEmitToNoti),
                  timestamp: new Date(),
                },
            });
            return await newChat.save();
        } catch (error) {
          throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
    
    async findAllChats(): Promise<Chat[] | null> {
        try {
            return await this.chatModel.find().exec();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findChatsBySender(sender: string): Promise<Chat[]| null> {
        try {
            return await this.chatModel.find({ sender }).exec();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    async findChatsByReceiver(receiver: string): Promise<Chat[]| null> {
        try {
            return await this.chatModel.find({ receiver }).exec();
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}
