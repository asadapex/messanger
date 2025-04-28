import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { GroupModule } from './group/group.module';

@Module({
  imports: [
    PrismaModule,
    ChatModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'apex',
    }),
    GroupModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
