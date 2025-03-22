import { IsOptional, IsString, MaxLength, MinLength, Validate } from "class-validator";

export class CreateMessageDto {
  @IsString()
  sender: string;  
  
  @IsString()
  receiver: string;    

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  message: string;   

  timestamp?: Date; 
}
  