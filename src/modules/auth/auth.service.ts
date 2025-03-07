import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { comparePassword } from 'src/utils/compare-password';
@Injectable()
export class AuthService {
  constructor(
    @Inject()
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) {}

  async signIn(email: string, password: string) {
    const user = await this.dataSource.manager.findOne(User, {
      where: {
        email: email,
      },
    });

    if (!user) throw new NotFoundException('Usuário não encontrado');

    const passwordIsCorrect = await comparePassword(password, user.password);

    if (!passwordIsCorrect) throw new BadRequestException('Senha incorreta');

    //mapeamento para não passar a senha para o jwt
    const payload = {
      email: user.email,
      userId: user.id,
      name: user.name,
    };

    const accessToken = this.jwtService.sign({ ...payload });

    return { accessToken };
  }
}
