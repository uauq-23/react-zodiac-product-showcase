import express from 'express';
import { protect } from '../middlewares/auth-mw.js';
import { validate } from '../middlewares/validate-mw.js';
import { createTodoSchema, updateTodoSchema, listTodoQuerySchema, todoIdParamSchema } from '../validators/todo-schema.js';
import * as todoController from '../controllers/todo-c.js';

const router = express.Router();

// Public route to check health
/** 
 * @openapi
 * /todos/health:
 *   get:
 *     tags: [Todos]
 *     summary: Kiểm tra trạng thái của todo router
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *               example:
 *                 ok: true
 */
router.get('/health', (req, res) => {
  return res.ok({ status: 'Todo router is healthy!' });
});

router.use(protect);

/**
 * @openapi
 * /todos:
 *   get:
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     summary: Lấy danh sách todos
 *     description: Lấy danh sách todos với pagination và filtering
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Số items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, DONE]
 *         description: Filter theo status
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter theo title (tìm kiếm partial)
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TodoListResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/', validate(listTodoQuerySchema, 'query'), todoController.listTodos);
/**
 * @openapi
 * /todos/{id}:
 *   get:
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     summary: Lấy chi tiết một todo theo ID
 *     description: Trả về chi tiết công việc dựa trên ID được cung cấp.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo id
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Todo"
 *       400:
 *         description: Invalid path parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.get('/:id', validate(todoIdParamSchema, 'params'), todoController.getTodo);

/**
 * @openapi
 * /todos:
 *   post:
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     summary: Tạo todo mới
 *     description: Tạo một công việc mới
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CreateTodoRequest"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Todo"
 *       400:
 *         description: Invalid request body
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.post('/', validate(createTodoSchema, 'body'), todoController.createTodo);
/**
 * @openapi
 * /todos/{id}:
 *   patch:
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     summary: Cập nhật todo
 *     description: Cập nhật thông tin của một todo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo id
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UpdateTodoRequest"
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Todo"
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.patch(
    "/:id",
    validate(todoIdParamSchema, "params"),
    validate(updateTodoSchema, "body"),
    todoController.updateTodo
);
/**
 * @openapi
 * /todos/{id}:
 *   delete:
 *     tags: [Todos]
 *     security:
 *       - BearerAuth: []
 *     summary: Xóa todo
 *     description: Xóa một todo theo ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Todo id
 *         schema:
 *           type: integer
 *           minimum: 1
 *           example: 1
 *     responses:
 *       204:
 *         description: No Content
 *       400:
 *         description: Invalid path parameter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ErrorResponse"
 */
router.delete('/:id', validate(todoIdParamSchema, 'params'), todoController.deleteTodo);

export default router;