import Joi from 'joi';
import AppError from '../utils/app-error.js';

export const createTodoSchema = Joi.object({
  title: Joi.string().min(1).max(255).required(),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('PENDING', 'DONE').optional(),
  due_date: Joi.date().iso().optional()
});

export const updateTodoSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  description: Joi.string().allow('').optional(),
  status: Joi.string().valid('PENDING', 'DONE').optional(),
  due_date: Joi.date().iso().optional()
});

export const listTodoQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  status: Joi.string().valid('PENDING', 'DONE').optional(),
  q: Joi.string().optional(),
  dueFrom: Joi.date().iso().optional(),
  dueTo: Joi.date().iso().optional(),
  createdFrom: Joi.date().iso().optional(),
  createdTo: Joi.date().iso().optional(),
  sort: Joi.string().optional(),
  fields: Joi.array().items(Joi.string()).optional(),
  cursor: Joi.string().optional()
});

export const todoIdParamSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

export function decodeCursorOrThrow(cursor) {
    try {
        const decoded = Buffer.from(cursor, 'base64').toString('utf8');
        const { id } = JSON.parse(decoded);
        if (!Number.isInteger(id) || id <= 0) throw new Error("invalid cursor id");
        return { id };
    } catch {
        throw AppError.badRequest('VALIDATION_ERROR', 'Invalid cursor', [
            { field: 'cursor', issue: 'cursor must be base64(JSON) like eyJpZCI6MTIzfQ==' },
        ]);
    }
}

export function encodeCursor({ id }) {
    return Buffer.from(JSON.stringify({ id }), 'utf8').toString('base64');
}