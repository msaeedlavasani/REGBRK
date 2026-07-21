export interface AuthTokenService {
  generateToken(payload: { userId: string; email: string }): Promise<string>;
}

export const AUTH_TOKEN_SERVICE = Symbol('AUTH_TOKEN_SERVICE');
