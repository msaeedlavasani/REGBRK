import { User } from './user.entity';

describe('User Entity', () => {
  it('should create a valid user', () => {
    const user = User.create({
      email: 'jane@example.com',
      fullName: 'Jane Doe',
    });

    expect(user.email.toString()).toBe('jane@example.com');
    expect(user.fullName).toBe('Jane Doe');
    expect(user.id).toBeDefined();
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should throw when fullName is too short', () => {
    expect(() =>
      User.create({ email: 'jane@example.com', fullName: 'J' }),
    ).toThrow();
  });

  it('should throw when email is invalid', () => {
    expect(() =>
      User.create({ email: 'invalid-email', fullName: 'Jane Doe' }),
    ).toThrow();
  });
});
