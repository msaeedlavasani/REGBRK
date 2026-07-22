import { Money } from './money.vo';

describe('Money Value Object', () => {
  it('should create a valid money amount', () => {
    const money = Money.create(1500000);
    expect(money.toNumber()).toBe(1500000);
  });

  it('should throw when amount is zero', () => {
    expect(() => Money.create(0)).toThrow();
  });

  it('should throw when amount is negative', () => {
    expect(() => Money.create(-100)).toThrow();
  });

  it('should throw when amount is not a number', () => {
    expect(() => Money.create(NaN)).toThrow();
  });
});
