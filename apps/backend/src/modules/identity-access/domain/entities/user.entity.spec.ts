import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a valid user', async () => {
    const user = await User.create({
      email: 'jane@example.com',
      fullName: 'Jane Doe',
      password: 'SomePassword123',
    });

    expect(user.email.toString()).toBe('jane@example.com');
    expect(user.fullName).toBe('Jane Doe');
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should throw when fullName is too short', async () => {
    await expect(
      User.create({
        email: 'jane@example.com',
        fullName: 'J',
        password: 'SomePassword123',
      }),
    ).rejects.toThrow();
  });

  it('should throw when email is invalid', async () => {
    await expect(
      User.create({
        email: 'invalid-email',
        fullName: 'Jane Doe',
        password: 'SomePassword123',
      }),
    ).rejects.toThrow();
  });

  it('should throw when password is too short', async () => {
    await expect(
      User.create({
        email: 'jane@example.com',
        fullName: 'Jane Doe',
        password: 'short',
      }),
    ).rejects.toThrow();
  });
});
