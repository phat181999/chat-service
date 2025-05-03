import { IsOptional, IsString, MaxLength, MinLength, Validate } from "class-validator";

export class CreateMessageDto {
  @IsString()
  sender: string;  
  
  @IsString()
  receiver: string;    

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  message: object;   

  @IsOptional()
  fileUrls: {
    [key: string]: string;
  };

  @IsOptional()
  senderName?: string;

  timestamp?: Date; 
}
  
export class CreateMessageResponseDto {
  @IsString()
  sender: string;  
  
  @IsString()
  receiver: string;    

  @IsString()
  message: object;   

  @IsOptional()
  fileUrls: {
    [key: string]: string;
  };

  timestamp?: Date; 
}