import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { JoinGroupDto } from './dto/join-group.dto';
import { GroupMessage } from '@prisma/client';

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @UseGuards(AuthGuard)
  @Post('create')
  create(@Body() createGroupDto: CreateGroupDto, @Req() req: Request) {
    return this.groupService.create(createGroupDto, req);
  }

  @UseGuards(AuthGuard)
  @Post('join')
  joinGr(@Body() data: JoinGroupDto, @Req() req: Request) {
    return this.groupService.joinGr(data, req);
  }

  @UseGuards(AuthGuard)
  @Get('mine')
  findAll(@Req() req: Request) {
    return this.groupService.findAll(req);
  }

  @UseGuards(AuthGuard)
  @Post('message')
  grMessage(@Body() data: GroupMessage, @Req() req: Request) {
    return this.groupService.grMessage(data, req);
  }
}
