import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type MessageType = {
    type: 'text' | 'image' | 'video';
    content: string;
};

@Schema()
export class Chat extends Document {
    @Prop({ required: true })
    sender: string;

    @Prop({ required: true })
    receiver: string;

    @Prop({ required: true, type: Object })
    message: MessageType;

    @Prop({ required: true, type: Object })
    fileUrls: {
        [key: string]: string;
    };

    @Prop({ default: Date.now })
    timestamp?: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);