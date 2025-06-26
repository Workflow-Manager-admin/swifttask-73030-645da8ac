//
// Service for managing tasks in memory
//

let nextTaskId = 1;
const tasks = [];

// PUBLIC_INTERFACE
function getAllTasks() {
  /** Returns all tasks as an array. */
  return tasks;
}

// PUBLIC_INTERFACE
function getTaskById(id) {
  /** Returns the task matching the id, or null if not found. */
  return tasks.find((task) => task.id === id) || null;
}

// PUBLIC_INTERFACE
function createTask({ title, description }) {
  /** Creates a new task with the specified title and description. */
  if (!title) throw new Error('Title is required');
  const now = new Date().toISOString();
  const newTask = {
    id: nextTaskId++,
    title,
    description: description || '',
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  return newTask;
}

// PUBLIC_INTERFACE
function updateTask(id, { title, description }) {
  /** Updates a task's title or description.
   * Returns updated task, or null if not found.
   */
  const task = getTaskById(id);
  if (!task) return null;
  if (typeof title !== 'undefined') task.title = title;
  if (typeof description !== 'undefined') task.description = description;
  task.updatedAt = new Date().toISOString();
  return task;
}

// PUBLIC_INTERFACE
function setTaskCompleted(id, completed) {
  /** Sets the completed status of a task.
   * Returns updated task, or null if not found.
   */
  const task = getTaskById(id);
  if (!task) return null;
  task.completed = !!completed;
  task.updatedAt = new Date().toISOString();
  return task;
}

// PUBLIC_INTERFACE
function deleteTask(id) {
  /** Deletes a task by id. Returns true if deleted, false if not found. */
  const idx = tasks.findIndex((task) => task.id === id);
  if (idx === -1) return false;
  tasks.splice(idx, 1);
  return true;
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  setTaskCompleted,
  deleteTask,
};
