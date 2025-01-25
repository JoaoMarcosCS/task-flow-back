import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { commandHandlers } from './commands';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './entities/board.entity';
import { queryHandlers } from './queries';

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Board])],
  controllers: [BoardController],
  providers: [BoardService, ...commandHandlers, ...queryHandlers],
})
export class BoardModule {}
