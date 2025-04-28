import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Request } from 'express';

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: CreateChatDto, req: Request) {
    const chat = await this.prisma.chat.findMany({
      where: { fromId: req['user-id'], toId: data.toId },
    });
    if (chat) {
      throw new BadRequestException('Chat already exists');
    }
    const newChat = await this.prisma.chat.create({
      data: { fromId: req['user-id'], toId: data.toId },
    });
    return newChat;
  }

  async findAll(req: Request) {
    const myChats = await this.prisma.chat.findMany({
      where: { OR: [{ fromId: req['user-id'] }, { toId: req['user-id'] }] },
      include: {
        from: { select: { id: true, name: true, username: true } },
        to: { select: { id: true, name: true, username: true } },
      },
    });
    console.log(req['user-id']);

    return myChats;
  }

  async sendMessage(data: CreateMessageDto, req: Request) {
    const fromUser = await this.prisma.user.findUnique({
      where: { id: req['user-id'] },
    });

    const toUser = await this.prisma.user.findUnique({
      where: { id: data.toId },
    });

    if (!fromUser) {
      throw new BadRequestException('Sender not found');
    }

    if (!toUser) {
      throw new BadRequestException('Recipient not found');
    }

    const newMessage = await this.prisma.message.create({
      data: {
        fromId: req['user-id'],
        chatId: data.chatId,
        text: data.text,
        toId: data.toId,
      },
      include: {
        from: { select: { id: true, name: true, username: true } },
        to: { select: { id: true, name: true, username: true } },
        Chat: true,
      },
    });

    return newMessage;
  }
}
