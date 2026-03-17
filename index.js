import * as todoService from '../services/todo-s.js';

export async function listTodos(req, res) {
    try {
        const result = await todoService.listTodos({ userId: req.user.id, query: req.validated.query });
        return res.list(result.items, result.meta);
    } catch (error) {
        return res.error(error);
    }
}

export async function getTodo(req, res) {
    try {
        const todo = await todoService.getTodo({ userId: req.user.id, id: req.validated.params.id });
        return res.ok(todo);
    } catch (error) {
        return res.error(error);
    }
}

export async function createTodo(req, res) {
    try {
        const created = await todoService.createTodo({ userId: req.user.id, data: req.validated.body });
        return res.created(created);
    } catch (error) {
        return res.error(error);
    }
}

export async function updateTodo(req, res) {
    try {
        const updated = await todoService.updateTodo({
            userId: req.user.id,
            id: req.validated.params.id,
            data: req.validated.body,
        });
        return res.ok(updated);
    } catch (error) {
        return res.error(error);
    }
}

export async function deleteTodo(req, res) {
    try {
        await todoService.deleteTodo({ userId: req.user.id, id: req.validated.params.id });
        res.noContent();
    } catch (error) {
        return res.error(error);
    }
}