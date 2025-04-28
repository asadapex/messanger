import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupMessage } from '@prisma/client';

@Injectable()
export class GroupService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateGroupDto, req: Request) {
    const newGr = await this.prisma.group.create({ data });
    return newGr;
  }

  async joinGr(data: JoinGroupDto, req: Request) {
    const newJoin = await this.prisma.user.update({
      where: { id: req['user-id'] },
      data: {
        groups: { connect: { id: data.groupId } },
      },
    });
    return newJoin;
  }

  async findAll(req: Request) {
    const all = await this.prisma.user.findMany({
      where: {
        groups: {
          some: {
            users: {
              some: {
                id: req['user-id'],
              },
            },
          },
        },
      },
    });
    return all;
  }

  async grMessage(data: GroupMessage, req: Request) {
    const newMessage = await this.prisma.groupMessage.create({
      data: { ...data, fromId: req['user-id'] },
      include: { group: true, from: true },
    });

    return newMessage;
  }
}
