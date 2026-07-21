import { LoginUseCase } from './login.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthTokenService } from '../../domain/repositories/auth-token.service';
import { User } from '../../domain/entities/user.entity';
import { InvalidCredentialsError } from '../errors/invalid-credentials.error';

function createMockRepository(): jest.Mocked<UserRepository> {
  return { save: jest.fn(), findById: jest.fn(), findByEmail: jest.fn() };
}

function createMockTokenService(): jest.Mocked<AuthTokenService> {
  return { generateToken: jest.fn() };
}

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;
  let mockRepo: jest.Mocked<UserRepository>;
  let mockTokenService: jest.Mocked<AuthTokenService>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    mockTokenService = createMockTokenService();
    useCase = new LoginUseCase(mockRepo, mockTokenService);
  });

  it('should return a token on valid credentials', async () => {
    const user = await User.create({
      email: 'login@example.com',
      fullName: 'Login User',
      password: 'CorrectPass123',
    });
    mockRepo.findByEmail.mockResolvedValue(user);
    mockTokenService.generateToken.mockResolvedValue('fake-jwt-token');

    const result = await useCase.execute({
      email: 'login@example.com',
      password: 'CorrectPass123',
    });

    expect(result.accessToken).toBe('fake-jwt-token');
  });

  it('should throw InvalidCredentialsError when email does not exist', async () => {
    mockRepo.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({ email: 'nobody@example.com', password: 'x' }),
    ).rejects.toThrow(InvalidCredentialsError);
  });

  it('should throw InvalidCredentialsError when password is wrong', async () => {
    const user = await User.create({
      email: 'login2@example.com',
      fullName: 'Login User',
      password: 'CorrectPass123',
    });
    mockRepo.findByEmail.mockResolvedValue(user);

    await expect(
      useCase.execute({
        email: 'login2@example.com',
        password: 'WrongPassword',
      }),
    ).rejects.toThrow(InvalidCredentialsError);
  });
});
