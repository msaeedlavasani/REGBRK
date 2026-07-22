import { randomUUID } from 'crypto';

export class PropertyId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(): PropertyId {
    return new PropertyId(randomUUID());
  }

  static fromString(value: string): PropertyId {
    if (!value || value.trim().length === 0) {
      throw new Error('PropertyId cannot be empty');
    }
    return new PropertyId(value);
  }

  toString(): string {
    return this.value;
  }

  equals(other: PropertyId): boolean {
    return this.value === other.value;
  }
}
