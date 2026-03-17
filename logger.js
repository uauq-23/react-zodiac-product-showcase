export const AuthSchemas = {
  SignupRequest: {
    type: "object",
    required: ["name", "email", "password", "passwordConfirm"],
    properties: {
      name: { type: "string", minLength: 2, maxLength: 100 },
      email: { type: "string", format: "email", maxLength: 255 },
      password: { type: "string", minLength: 8, maxLength: 128 },
      passwordConfirm: { type: "string" },
    },
    example: {
      name: "John Doe",
      email: "john@example.com",
      password: "Password123",
      passwordConfirm: "Password123",
    },
  },
  LoginRequest: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string" },
    },
    example: {
      email: "john@example.com",
      password: "Password123",
    },
  },
  RefreshTokenRequest: {
    type: "object",
    required: ["refreshToken"],
    properties: {
      refreshToken: { type: "string" },
    },
    example: {
      refreshToken: "abc123...",
    },
  },
  LogoutRequest: {
    type: "object",
    properties: {
      refreshToken: { type: "string" },
    },
    example: {
      refreshToken: "abc123...",
    },
  },
  AuthResponse: {
    type: "object",
    properties: {
      user: { $ref: "#/components/schemas/User" },
      accessToken: { type: "string" },
      refreshToken: { type: "string" },
      accessTokenExpiresIn: { type: "string" },
      refreshTokenExpiresIn: { type: "string" },
    },
    example: {
      user: {
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      },
      accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      refreshToken: "abc123...",
      accessTokenExpiresIn: "15m",
      refreshTokenExpiresIn: "7d",
    },
  },
  MessageResponse: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
    example: {
      message: "Logged out successfully",
    },
  },
};
