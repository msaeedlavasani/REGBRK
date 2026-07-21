import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserOrmEntity } from './infrastructure/persistence/user.orm-entity';
import { TypeOrmUserRepository } from './infrastructure/persistence/typeorm-user.repository';
import { USER_REPOSITORY } from './domain/repositories/user.repository';
import { AUTH_TOKEN_SERVICE } from './domain/repositories/auth-token.service';
import { JwtAuthTokenService } from './infrastructure/auth/jwt-auth-token.service';
import { JwtStrategy } from './infrastructure/auth/jwt.strategy';
import { JwtAuthGuard } from './infrastructure/auth/jwt-auth.guard';
import { RegisterUserUseCase } from './application/commands/register-user.use-case';
import { GetUserByIdUseCase } from './application/queries/get-user-by-id.use-case';
import { LoginUseCase } from './application/commands/login.use-case';
import { UserController } from './presentation/controllers/user.controller';
import { AuthController } from './presentation/controllers/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
        signOptions: {
          expiresIn: Number(config.get<string>('JWT_EXPIRES_IN')) || 3600,
        },
      }),
    }),
  ],
  controllers: [UserController, AuthController],
  providers: [
    {
      provide: USER_REPOSITORY,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: AUTH_TOKEN_SERVICE,
      useClass: JwtAuthTokenService,
    },
    RegisterUserUseCase,
    GetUserByIdUseCase,
    LoginUseCase,
    JwtStrategy,
    JwtAuthGuard,
  ],
  exports: [USER_REPOSITORY, RegisterUserUseCase, GetUserByIdUseCase],
})
export class IdentityAccessModule {}
