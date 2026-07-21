import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.vo';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { UserNotFoundError } from '../errors/user-not-found.error';

@Injectable()
export class GetUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<User> {
    const userId = UserId.fromString(id);
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }
}
