import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export interface UserProps {
  id: UserId;
  email: Email;
  fullName: string;
  password: Password;
  createdAt: Date;
}

export class User {
  private readonly props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static async create(params: {
    email: string;
    fullName: string;
    password: string;
  }): Promise<User> {
    if (!params.fullName || params.fullName.trim().length < 2) {
      throw new Error('fullName must be at least 2 characters long');
    }

    const password = await Password.createFromPlainText(params.password);

    return new User({
      id: UserId.create(),
      email: Email.create(params.email),
      fullName: params.fullName.trim(),
      password,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: UserProps): User {
    return new User(props);
  }

  get id(): UserId {
    return this.props.id;
  }

  get email(): Email {
    return this.props.email;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get passwordHash(): string {
    return this.props.password.toHash();
  }

  async comparePassword(plainText: string): Promise<boolean> {
    return this.props.password.compare(plainText);
  }
}
