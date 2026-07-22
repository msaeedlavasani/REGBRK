export class PropertyNotFoundError extends Error {
  constructor(id: string) {
    super(`Property with id "${id}" was not found.`);
    this.name = 'PropertyNotFoundError';
  }
}
