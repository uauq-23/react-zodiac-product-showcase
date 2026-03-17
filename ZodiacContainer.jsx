import AppError from '../utils/app-error.js';
import Todo from '../models/todo.js';
import { decodeCursorOrThrow, encodeCursor } from '../validators/todo-schema.js';

// due_date (nếu có) không được nhỏ hơn hôm nay
function assertDueDateNotPast(dueDate) {
    if (!dueDate) return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (dueDate < today) {
        throw AppError.badRequest("BUSINESS_RULE_VIOLATION", "due_date must be today or later", [
            { field: "due_date", issue: "Must be >= today" },
        ]);
    }
}

export async function createTodo({ userId, data }) {
    assertDueDateNotPast(data.due_date);
    return Todo.create({ userId, data });
}

export async function updateTodo({ userId, id, data }) {
    const todo = await Todo.findById({ id });
    if (!todo) throw AppError.notFound("TODO_NOT_FOUND", "Todo not found");

    // ownership rule
    if (todo.user_id !== userId) {
        throw AppError.forbidden("TODO_FORBIDDEN_OWNER", "You can only modify your own todo");
    }

    if (data.due_date !== undefined) assertDueDateNotPast(data.due_date);

    return Todo.update({ id, data });
}

export async function deleteTodo({ userId, id }) {
    const todo = await Todo.findById({ id });
    if (!todo) throw AppError.notFound("TODO_NOT_FOUND", "Todo not found");
    if (todo.user_id !== userId) throw AppError.forbidden("TODO_FORBIDDEN_OWNER", "You can only delete your own todo");

    await Todo.delete(id);
}

export async function getTodo({ userId, id }) {
    const todo = await Todo.findByIdAndUserId({ id, userId });
    if (!todo) throw AppError.notFound("TODO_NOT_FOUND", "Todo not found");
    return todo;
}

// List todos: offset mode (default) OR cursor mode (if cursor provided)
export async function listTodos({ userId, query }) {
    const filters = {
        status: query.status,
        q: query.q,
        dueFrom: query.dueFrom,
        dueTo: query.dueTo,
        createdFrom: query.createdFrom,
        createdTo: query.createdTo,
    };

    // cursor mode
    if (query.cursor) {
        const { id: afterId } = decodeCursorOrThrow(query.cursor);
        const { items } = await Todo.listCursor({
            userId,
            filters,
            fields: query.fields,
            limit: query.limit,
            afterId,
        });

        const last = items.at(-1);
        const nextCursor = last ? encodeCursor({ id: last.id }) : null;

        return {
            mode: "cursor",
            items,
            meta: { limit: query.limit, nextCursor },
        };
    }

    // offset mode
    const limit = query.limit;
    const page = query.page;
    const offset = (page - 1) * limit;

    const { items, total } = await Todo.listOffset({
        userId,
        filters,
        sort: query.sort,
        fields: query.fields,
        limit,
        offset,
    });

    return {
        mode: "offset",
        items,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 0,
        },
    };
}