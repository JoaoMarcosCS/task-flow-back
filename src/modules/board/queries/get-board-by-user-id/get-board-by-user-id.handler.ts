import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetBoardByUserIdDto } from './get-board-by-user-id.dto';
import { GetBoardByUserIdQuery } from './get-board-by-user-id.query';
import { DataSource } from 'typeorm';
import { Board } from '../../entities/board.entity';
import { BoardUserRole } from '../../entities/board_user_role.entity';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

@QueryHandler(GetBoardByUserIdQuery)
export class GetBoardByUserIdHandler
  implements IQueryHandler<GetBoardByUserIdQuery, GetBoardByUserIdDto>
{
  constructor(private readonly dataSource: DataSource) {}

  async execute(query: GetBoardByUserIdQuery): Promise<GetBoardByUserIdDto> {
    const { userId, boardId } = query;

    if (!userId || !boardId)
      throw new BadRequestException('Usuário ou board não encontrado');

    const board_users_roles = await this.dataSource.manager.find(
      BoardUserRole,
      {
        where: {
          boardId,
        },
        relations: ['role'],
        select: {
          role: {
            description: true,
            id: true,
          },
        },
      },
    );

    if (!board_users_roles)
      throw new UnauthorizedException(
        'Usuário não autorizado para entrar nesta board de tarefas',
      );

    const board = await this.dataSource.manager.find(Board, {
      where: {
        id: query.boardId,
      },
      relations: [
        'members',
        'tasks',
        'tasks.priority',
        'tasks.status',
        'tasks.assignees',
      ],
      select: {
        id: true,
        title: true,
        description: true,
        created_at: true,
        update_at: true,
        tasks: {
          assignees: {
            id: true,
            name: true,
            email: true,
          },
          created_at: true,
          update_at: true,
          title: true,
          id: true,
          description: true,
          priority: {
            description: true,
          },
          status: {
            description: true,
          },
        },
        members: {
          id: true,
          name: true,
          email: true,
        },
      },
      order: {
        tasks: {
          update_at: 'DESC',
        },
      },
    });

    return {
      board: board[0],
      total_members: board[0]?.members.length ?? 0,
      total_tasks: board[0]?.tasks?.length ?? 0,
      board_users_roles,
    };
  }
}
