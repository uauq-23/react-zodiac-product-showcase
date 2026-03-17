export const UserSchemas = {
  User: {
    type: "object",
    required: ["id", "username", "email"],
    properties: {
      id: { type: "integer", format: "int32" },
      username: { type: "string", minLength: 1 },
      email: { type: "string", format: "email" },
    },
    example: {
      id: 10,
      username: "john_doe",
      email: "john@example.com",
    },
  },
};