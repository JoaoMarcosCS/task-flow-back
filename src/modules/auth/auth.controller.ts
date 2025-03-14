import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorator/public-route.decorator';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signIn')
  @ApiOperation({ summary: 'Pegue o token de acesso' })
  @ApiBody({
    description: 'User data',
    type: SignInDto,
  })
  @ApiResponse({ status: 200, description: 'Retorna o token de acesso' })
  async signIn(
    @Body()
    body: SignInDto,
  ) {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }
}
