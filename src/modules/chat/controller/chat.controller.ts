import { Controller, Get, Post, Body, Param, HttpCode, HttpStatus, Logger, HttpException, UseGuards, Req, Res, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { ChatService } from '../service/chat.service';
import { Chat } from '../entity/chat.entity';
import { Response } from '../../../shared/interface/response';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { storage } from 'src/common/interceptors/cloudinary-storage';

@Controller('chat')
export class ChatController {
    private logger: Logger;
    constructor(private readonly chatService: ChatService) {
        this.logger = new Logger(ChatController.name);
    }

    @UseInterceptors(
        FilesInterceptor('files', 10, { storage }),
    )
    @UseGuards(AuthGuard)
    @Post('create-chat')
    @HttpCode(HttpStatus.CREATED)
    async createChat(
        @Body() chat: Chat,
        @Req() req,
        @Res() res,
        @UploadedFiles() files: Express.Multer.File[] 
    ): Promise<Chat | HttpException> {
        try{
            this.logger.log(`createChat: ${JSON.stringify(chat)}`);
            const userId = req.user.sub;
            const { receiver, message } = chat;
            let fileDetails: string[] = [];
            if (files && files.length > 0) {
                fileDetails = files.map((file: Express.Multer.File) => file.path);
            }
            const data = await this.chatService.createChat({
                sender: userId,
                receiver,
                message,
                fileUrls: fileDetails
            } as unknown as Chat);

            return res.status(HttpStatus.CREATED).json({
                data: data,
                message: 'Chat created successfully',
                status: HttpStatus.CREATED
            });
        } catch (error) {
            this.logger.error(`createChat: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get()
    async findAllChats( @Res() res): Promise<Response<Chat[]> | HttpException> {
        try {
            this.logger.log(`findAllChats`);
            const rs = await this.chatService.findAllChats();
            return res.status(HttpStatus.CREATED).json({
                data: rs,
                message: 'Chat created successfully',
                status: HttpStatus.CREATED
            });
        } catch (error) {
            this.logger.error(`findAllChats: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @HttpCode(HttpStatus.OK)
    @Get('sender/:sender')
    async findChatsBySender(
        @Param('sender') sender: string,
        @Res() res
    ): Promise<Response<Chat[]> | HttpException> {
        try {
            this.logger.log(`findChatsBySender: ${sender}`);
            const rs = await this.chatService.findChatsBySender(sender);
            return res.status(HttpStatus.CREATED).json({
                data: rs,
                message: 'Chat created successfully',
                status: HttpStatus.CREATED
            }); 
        } catch (error) {
            this.logger.error(`findChatsBySender: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    
    @Get('receiver/:receiver')
    async findChatsByReceiver(
        @Param('receiver') receiver: string,
        @Res() res
    ): Promise<Response<Chat[]> | HttpException> {
        try {
            this.logger.log(`findChatsByReceiver: ${receiver}`);
            const rs = await this.chatService.findChatsByReceiver(receiver);
            return res.status(HttpStatus.CREATED).json({
                data: rs,
                message: 'Chat created successfully',
                status: HttpStatus.CREATED
            });
        } catch (error) {
            this.logger.error(`findChatsByReceiver: ${error.message}`);
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }
}