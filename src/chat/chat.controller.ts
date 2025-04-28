import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createChatDto: CreateChatDto, @Req() req: Request) {
    return this.chatService.create(createChatDto, req);
  }

  @UseGuards(AuthGuard)
  @Get('my-chats')
  findAll(@Req() req: Request) {
    return this.chatService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Post('message')
  sendMessage(@Body() createMessageDto: CreateMessageDto, @Req() req: Request) {
    return this.chatService.sendMessage(createMessageDto, req);
  }
}
