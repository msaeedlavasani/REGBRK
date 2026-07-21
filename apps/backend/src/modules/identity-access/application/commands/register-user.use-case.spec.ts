/* eslint-disable @typescript-eslint/unbound-method */
import { RegisterUserUseCase } from './register-user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { EmailAlreadyExistsError } from '../errors/email-already-exists.error';

function createMockRepository(): jest.Mocked<UserRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };
}

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    useCase = new RegisterUserUseCase(mockRepo);
  });

  it('should register a new user successfully', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue(undefined);

    const result = await useCase.execute({
      email: 'new-user@example.com',
      fullName: 'New User',
      password: 'SomePassword123',
    });

    expect(result).toBeInstanceOf(User);
    expect(result.email.toString()).toBe('new-user@example.com');
    expect(mockRepo.save).toHaveBeenCalledTimes(1);
  });

  it('should throw EmailAlreadyExistsError when email already exists', async () => {
    const existingUser = await User.create({
      email: 'existing@example.com',
      fullName: 'Existing User',
      password: 'SomePassword123',
    });
    mockRepo.findByEmail.mockResolvedValue(existingUser);

    await expect(
      useCase.execute({
        email: 'existing@example.com',
        fullName: 'Another Name',
        password: 'SomePassword123',
      }),
    ).rejects.toThrow(EmailAlreadyExistsError);

    expect(mockRepo.save).not.toHaveBeenCalled();
  });
});
