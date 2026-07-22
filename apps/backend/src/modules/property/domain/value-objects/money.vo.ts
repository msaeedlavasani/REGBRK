export class Money {
  private readonly amount: number;

  private constructor(amount: number) {
    this.amount = amount;
  }

  static create(amount: number): Money {
    if (typeof amount !== 'number' || Number.isNaN(amount)) {
      throw new Error('Money amount must be a valid number');
    }
    if (amount <= 0) {
      throw new Error('Money amount must be greater than zero');
    }
    return new Money(amount);
  }

  toNumber(): number {
    return this.amount;
  }

  equals(other: Money): boolean {
    return this.amount === other.amount;
  }
}
