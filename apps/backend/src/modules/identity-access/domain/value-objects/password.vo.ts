import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export class Password {
  private readonly hashedValue: string;

  private constructor(hashedValue: string) {
    this.hashedValue = hashedValue;
  }

  static async createFromPlainText(plainText: string): Promise<Password> {
    if (!plainText || plainText.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    const hashed = await bcrypt.hash(plainText, SALT_ROUNDS);
    return new Password(hashed);
  }

  static fromHash(hashedValue: string): Password {
    return new Password(hashedValue);
  }

  async compare(plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, this.hashedValue);
  }

  toHash(): string {
    return this.hashedValue;
  }
}
