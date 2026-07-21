import { Password } from './password.vo';

describe('Password Value Object', () => {
  it('should hash the password and verify correct match', async () => {
    const password = await Password.createFromPlainText('MySecret123');
    const isMatch = await password.compare('MySecret123');
    expect(isMatch).toBe(true);
  });

  it('should reject an incorrect password', async () => {
    const password = await Password.createFromPlainText('MySecret123');
    const isMatch = await password.compare('WrongPassword');
    expect(isMatch).toBe(false);
  });

  it('should throw when password is too short', async () => {
    await expect(Password.createFromPlainText('short')).rejects.toThrow();
  });
});
