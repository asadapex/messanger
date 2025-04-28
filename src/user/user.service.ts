import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async findUser(params: { username?: string; phone?: string }) {
    const { username, phone } = params;
    if (phone) {
      const user = await this.prisma.user.findUnique({ where: { phone } });
      return user;
    }
    if (username) {
      const user = await this.prisma.user.findUnique({ where: { username } });
      return user;
    }
  }

  async register(data: CreateUserDto) {
    const username_exists = await this.findUser({ username: data.username });
    const phone_exists = await this.findUser({ phone: data.phone });
    if (username_exists) {
      throw new BadRequestException('This username already exists');
    }
    if (phone_exists) {
      throw new BadRequestException('This phone number already registered');
    }
    const hash = bcrypt.hashSync(data.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        phone: data.phone,
        password: hash,
      },
    });
    return newUser;
  }

  async login(data: LoginUserDto) {
    const user = await this.findUser({ phone: data.phone });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const match = bcrypt.compareSync(data.password, user.password);
    if (!match) {
      throw new BadRequestException('Wrong password');
    }
    const token = this.jwt.sign({ id: user.id });

    return { token };
  }

  async findAll() {
    const all = await this.prisma.user.findMany();
    return all;
  }
}
