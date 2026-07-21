export class EmailAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`A user with email "${email}" already exists.`);
    this.name = 'EmailAlreadyExistsError';
  }
}
