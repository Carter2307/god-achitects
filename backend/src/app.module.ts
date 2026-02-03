import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user.module';  
import { AppController } from './app.controller';

@Module({
  imports: [
    PrismaModule, 
    UserModule  
  ],
  controllers: [AppController],
})
export class AppModule {}