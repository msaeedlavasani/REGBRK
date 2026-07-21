import {
  Body,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { RegisterUserUseCase } from '../../application/commands/register-user.use-case';
import { GetUserByIdUseCase } from '../../application/queries/get-user-by-id.use-case';
import { EmailAlreadyExistsError } from '../../application/errors/email-already-exists.error';
import { UserNotFoundError } from '../../application/errors/user-not-found.error';
import { CreateUserRequestDto } from '../dto/create-user-request.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
  ) {}

  @Post()
  @ApiResponse({ status: 201, type: UserResponseDto })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(@Body() dto: CreateUserRequestDto): Promise<UserResponseDto> {
    try {
      const user = await this.registerUserUseCase.execute(dto);
      return UserResponseDto.fromDomain(user);
    } catch (error) {
      if (error instanceof EmailAlreadyExistsError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Get(':id')
  @ApiResponse({ status: 200, type: UserResponseDto })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserResponseDto> {
    try {
      const user = await this.getUserByIdUseCase.execute(id);
      return UserResponseDto.fromDomain(user);
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
}
