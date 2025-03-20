import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { Chat } from '../entity/chat.entity';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async createChat(
        @Body('sender') sender: string,
        @Body('receiver') receiver: string,
        @Body('message') message: string
    ): Promise<Chat> {
        return this.chatService.createChat(sender, receiver, message);
    }

    @Get()
    async findAllChats(): Promise<Chat[]> {
        return this.chatService.findAllChats();
    }

    @Get('sender/:sender')
    async findChatsBySender(@Param('sender') sender: string): Promise<Chat[]> {
        return this.chatService.findChatsBySender(sender);
    }

    @Get('receiver/:receiver')
    async findChatsByReceiver(@Param('receiver') receiver: string): Promise<Chat[]> {
        return this.chatService.findChatsByReceiver(receiver);
    }
}