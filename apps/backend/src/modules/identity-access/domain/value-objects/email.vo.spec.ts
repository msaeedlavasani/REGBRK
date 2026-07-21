import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = Email.create('user@example.com');
    expect(email.toString()).toBe('user@example.com');
  });

  it('should normalize email to lowercase', () => {
    const email = Email.create('User@Example.COM');
    expect(email.toString()).toBe('user@example.com');
  });

  it('should throw on invalid email format', () => {
    expect(() => Email.create('not-an-email')).toThrow();
  });

  it('should throw on empty string', () => {
    expect(() => Email.create('')).toThrow();
  });
});
