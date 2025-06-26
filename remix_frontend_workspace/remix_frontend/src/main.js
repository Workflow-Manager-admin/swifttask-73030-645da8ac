import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';

// REST API base URL
const API_BASE = 'http://localhost:3001'; // Change this if backend runs elsewhere

/**
 * Task fetch/update/delete helpers
 */

async function fetchTasks() {
  const resp = await fetch(`${API_BASE}/tasks`);
  if (!resp.ok) throw new Error('Failed to fetch tasks');
  return resp.json();
}

async function createTask(title, description) {
  const resp = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!resp.ok) {
    const { message } = await resp.json();
    throw new Error(message || 'Failed to create task');
  }
  return resp.json();
}

async function updateTask(id, { title, description }) {
  const resp = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description }),
  });
  if (!resp.ok) {
    const { message } = await resp.json();
    throw new Error(message || 'Failed to update task');
  }
  return resp.json();
}

async function setTaskCompleted(id, completed) {
  const resp = await fetch(`${API_BASE}/tasks/${id}/completed`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  if (!resp.ok) throw new Error('Failed to update completion');
  return resp.json();
}

async function deleteTask(id) {
  const resp = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });
  if (!resp.ok) throw new Error('Failed to delete');
  return true;
}

/**
 * TaskList UI
 */
function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addTitle, setAddTitle] = useState('');
  const [addDesc, setAddDesc] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  // Fetch tasks on load
  useEffect(() => {
    setLoading(true);
    fetchTasks()
      .then(setTasks)
      .catch(() => setError('Failed to load tasks'))
      .finally(() => setLoading(false));
  }, []);

  // Add task
  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const newTask = await createTask(addTitle.trim(), addDesc.trim());
      setTasks((prev) => [...prev, newTask]);
      setAddTitle('');
      setAddDesc('');
    } catch (e) {
      setError(e.message);
    }
  };

  // Start editing
  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
    setEditingDesc(task.description || '');
    setError('');
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
    setEditingDesc('');
    setError('');
  };

  // Save edit
  const handleEdit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const updated = await updateTask(editingId, {
        title: editingTitle.trim(),
        description: editingDesc.trim(),
      });
      setTasks((prev) =>
        prev.map((t) => (t.id === editingId ? updated : t))
      );
      cancelEdit();
    } catch (e) {
      setError(e.message);
    }
  };

  // Mark as completed
  const handleToggleCompleted = async (task) => {
    try {
      const updated = await setTaskCompleted(task.id, !task.completed);
      setTasks((prev) =>
        prev.map((t) => (t.id === task.id ? updated : t))
      );
    } catch (e) {
      setError('Failed to update status');
    }
  };

  // Delete
  const handleDelete = async (task) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await deleteTask(task.id);
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
    } catch {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="todo-app">
      <header>
        <h1>To-Do List</h1>
      </header>

      <form className="add-task-form" onSubmit={handleAdd} autoComplete="off">
        <input
          type="text"
          placeholder="Task title"
          value={addTitle}
          onChange={(e) => setAddTitle(e.target.value)}
          required
          maxLength={60}
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={addDesc}
          onChange={(e) => setAddDesc(e.target.value)}
          maxLength={120}
        />
        <button type="submit" aria-label="Add Task" disabled={addTitle === ''}>
          +
        </button>
      </form>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <ul className="task-list">
          {tasks.length === 0 && <li className="empty">No tasks yet.</li>}
          {tasks.map((task) =>
            editingId === task.id ? (
              <li className="task editing" key={task.id}>
                <form className="edit-task-form" onSubmit={handleEdit}>
                  <input
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    required
                    maxLength={60}
                  />
                  <input
                    type="text"
                    value={editingDesc}
                    onChange={(e) => setEditingDesc(e.target.value)}
                    maxLength={120}
                  />
                  <button type="submit" title="Save">&#10004;</button>
                  <button type="button" onClick={cancelEdit} title="Cancel">&#10006;</button>
                </form>
              </li>
            ) : (
              <li className={`task${task.completed ? ' completed' : ''}`} key={task.id}>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task)}
                  />
                  <span className="checkmark"></span>
                </label>
                <div className="task-info" onDoubleClick={() => startEdit(task)}>
                  <span className="task-title">{task.title}</span>
                  {task.description && (
                    <span className="task-desc">{task.description}</span>
                  )}
                </div>
                <div className="task-actions">
                  <button
                    className="edit-btn"
                    title="Edit"
                    onClick={() => startEdit(task)}
                  >&#9998;</button>
                  <button
                    className="delete-btn"
                    title="Delete"
                    onClick={() => handleDelete(task)}
                  >&#128465;</button>
                </div>
              </li>
            )
          )}
        </ul>
      )}

      <footer>
        <span>
          {tasks.length} task{tasks.length !== 1 ? 's' : ''} &mdash;{" "}
          <span className="footer-small">Double-click task for quick edit</span>
        </span>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById('app'));
root.render(<App />);
