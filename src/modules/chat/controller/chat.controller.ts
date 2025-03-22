import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Logger, HttpException } from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { Chat } from '../entity/chat.entity';
import { Response } from '../../../shared/interface/response';

@Controller('chat')
export class ChatController {
    private logger: Logger;
    constructor(private readonly chatService: ChatService) {
        this.logger = new Logger(ChatController.name);
    }

    @HttpCode(HttpStatus.CREATED)
    @Post()
    async createChat(
        @Body() chat: Chat
    ): Promise<Response<Chat> | HttpException> {
        try{
            this.logger.log(`createChat: ${JSON.stringify(chat)}`);
            const data = await this.chatService.createChat(chat);
            return {
                data: data,
                message: 'Chat created successfully',
                status: HttpStatus.CREATED
            };
        } catch (error) {
            this.logger.error(`createChat: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    async findAllChats(): Promise<Response<Chat[]> | HttpException> {
        try {
            this.logger.log(`findAllChats`);
            const rs = await this.chatService.findAllChats();
            return {
                data: rs,
                message: 'Get all chats successfully',
                status: HttpStatus.OK
            };
        } catch (error) {
            this.logger.error(`findAllChats: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get('sender/:sender')
    async findChatsBySender(@Param('sender') sender: string): Promise<Response<Chat[]> | HttpException> {
        try {
            this.logger.log(`findChatsBySender: ${sender}`);
            const rs = await this.chatService.findChatsBySender(sender);
            return {
                data: rs,
                message: 'Get all chats by sender successfully',
                status: HttpStatus.OK
            }; 
        } catch (error) {
            this.logger.error(`findChatsBySender: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    
    @Get('receiver/:receiver')
    async findChatsByReceiver(@Param('receiver') receiver: string): Promise<Response<Chat[]> | HttpException> {
        try {
            this.logger.log(`findChatsByReceiver: ${receiver}`);
            const rs = await this.chatService.findChatsByReceiver(receiver);
            return {
                data: rs,
                message: 'Get all chats by receiver successfully',
                status: HttpStatus.OK
            };
        } catch (error) {
            this.logger.error(`findChatsByReceiver: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}