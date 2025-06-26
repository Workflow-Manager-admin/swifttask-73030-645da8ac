const express = require('express');
const healthController = require('../controllers/health');
const tasksController = require('../controllers/tasks');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: Buy groceries
 *         description:
 *           type: string
 *           example: Milk, bread, eggs
 *         completed:
 *           type: boolean
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Get all tasks
 *     description: Retrieve a list of all tasks
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */
router.get('/tasks', tasksController.list.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task by id
 *     description: Retrieve a single task by its id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric id of the task to get
 *     responses:
 *       200:
 *         description: The found task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/tasks/:id', tasksController.get.bind(tasksController));

/**
 * @swagger
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Buy groceries
 *               description:
 *                 type: string
 *                 example: Milk, bread, eggs
 *     responses:
 *       201:
 *         description: The created task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
router.post('/tasks', tasksController.create.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Update an existing task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated task
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.put('/tasks/:id', tasksController.update.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}/completed:
 *   put:
 *     tags: [Tasks]
 *     summary: Mark a task as completed or not completed
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [completed]
 *             properties:
 *               completed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: The updated task with new completion status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Input missing or invalid
 *       404:
 *         description: Task not found
 */
router.put('/tasks/:id/completed', tasksController.markCompleted.bind(tasksController));

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 */
router.delete('/tasks/:id', tasksController.delete.bind(tasksController));

module.exports = router;
