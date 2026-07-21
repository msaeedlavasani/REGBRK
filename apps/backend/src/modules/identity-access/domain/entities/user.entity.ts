import { UserId } from '../value-objects/user-id.vo';
import { Email } from '../value-objects/email.vo';

export interface UserProps {
  id: UserId;
  email: Email;
  fullName: string;
  createdAt: Date;
}

export class User {
  private readonly props: UserProps;

  private constructor(props: UserProps) {
    this.props = props;
  }

  static create(params: { email: string; fullName: string }): User {
    if (!params.fullName || params.fullName.trim().length < 2) {
      throw new Error('fullName must be at least 2 characters long');
    }

    return new User({
      id: UserId.create(),
      email: Email.create(params.email),
      fullName: params.fullName.trim(),
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
}
