import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.vo';
import type { UserRepository } from '../../domain/repositories/user.repository';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository';
import { RegisterUserDto } from '../dto/register-user.dto';
import { EmailAlreadyExistsError } from '../errors/email-already-exists.error';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(dto: RegisterUserDto): Promise<User> {
    const email = Email.create(dto.email);

    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new EmailAlreadyExistsError(dto.email);
    }

    const user = User.create({
      email: dto.email,
      fullName: dto.fullName,
    });

    await this.userRepository.save(user);

    return user;
  }
}
