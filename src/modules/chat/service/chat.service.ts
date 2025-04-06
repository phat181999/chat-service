import { HttpException, HttpStatus, Inject, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Chat } from "../entity/chat.entity";
import { Model } from "mongoose";
import { KafkaService } from "src/shared/module/kafka/service/kafka.service";
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { TcpService } from "src/shared/module/tcp/service/tcp.service";

@Injectable()
export class ChatService  {
    private logger: Logger;
    constructor(
        @InjectModel(Chat.name) private chatModel: Model<Chat>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private tcpService: TcpService
      ) {
      this.logger = new Logger(ChatService.name);
    }

    async createChat(chat: Chat): Promise<Chat> {
        try {
          const { sender, receiver, message, fileUrls  } = chat;
          console.log(chat, "chat create")
          const cachedUser = await this.cacheManager.get(`user:${receiver}`);
          if (cachedUser === 'exists') {
            this.logger.log(`User ${receiver} exists in cache`);
            const newChat = new this.chatModel({
                sender,
                receiver,
                message,
                fileUrls,  // Save file URLs if present
                timestamp: new Date(),  // Use the timestamp or generate it
              });
              return await newChat.save();
          }
    
          const checkUser = await this.tcpService.checkUser(receiver);
          if(!checkUser) {
            throw new HttpException('Receiver not found', HttpStatus.NOT_FOUND);
          }
          const newChat = await new this.chatModel(chat);
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
