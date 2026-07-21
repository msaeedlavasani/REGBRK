/* eslint-disable @typescript-eslint/unbound-method */
import { GetUserByIdUseCase } from './get-user-by-id.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { User } from '../../domain/entities/user.entity';
import { UserNotFoundError } from '../errors/user-not-found.error';

function createMockRepository(): jest.Mocked<UserRepository> {
  return {
    save: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
  };
}

describe('GetUserByIdUseCase', () => {
  let useCase: GetUserByIdUseCase;
  let mockRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepo = createMockRepository();
    useCase = new GetUserByIdUseCase(mockRepo);
  });

  it('should return the user when found', async () => {
    const user = await User.create({
      email: 'found@example.com',
      fullName: 'Found User',
      password: 'SomePassword123',
    });
    mockRepo.findById.mockResolvedValue(user);

    const result = await useCase.execute(user.id.toString());

    expect(result).toBe(user);
    expect(mockRepo.findById).toHaveBeenCalledTimes(1);
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    mockRepo.findById.mockResolvedValue(null);

    const randomId = '11111111-1111-1111-1111-111111111111';

    await expect(useCase.execute(randomId)).rejects.toThrow(UserNotFoundError);
  });
});
