const tasksService = require('../services/tasks');

// PUBLIC_INTERFACE
class TasksController {
  /**
   * @swagger
   * tags:
   *   name: Tasks
   *   description: Task management endpoints
   */

  // Get all tasks
  async list(req, res) {
    const result = tasksService.getAllTasks();
    res.status(200).json(result);
  }

  // Get specific task
  async get(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid task id' });
    const task = tasksService.getTaskById(id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  }

  // Add task
  async create(req, res) {
    try {
      const { title, description } = req.body;
      const newTask = tasksService.createTask({ title, description });
      res.status(201).json(newTask);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  // Update task
  async update(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid task id' });
    const { title, description } = req.body;
    const updated = tasksService.updateTask(id, { title, description });
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updated);
  }

  // Mark as completed or not completed
  async markCompleted(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid task id' });
    const { completed } = req.body;
    if (typeof completed !== 'boolean')
      return res.status(400).json({ message: '`completed` boolean required' });
    const updated = tasksService.setTaskCompleted(id, completed);
    if (!updated) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(updated);
  }

  // Delete task
  async delete(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: 'Invalid task id' });
    const deleted = tasksService.deleteTask(id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.status(204).send();
  }
}

module.exports = new TasksController();
