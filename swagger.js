import { TodoSchemas } from './schemas/todo-schema.js';
import { UserSchemas } from './schemas/user-schema.js';
import { ErrorSchemas } from './schemas/error-schema.js';
import { AuthSchemas } from './schemas/auth-schema.js';

export const components = {
  schemas: {
    ...UserSchemas,
    ...TodoSchemas,
    ...ErrorSchemas,
    ...AuthSchemas,
  },
};