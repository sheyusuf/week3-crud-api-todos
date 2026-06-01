require("dotenv").config();

const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// GET All – Read
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id); // get id from URL
  const todo = todos.find(t => t.id === id); // find matching todo

  if (todo) {
    res.status(200).json(todo); // send single todo
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});


// POST New – Create
app.post('/todos', (req, res) => {
  const { task } = req.body;

  // Validate that 'task' is provided
  if (!task || task.trim() === '') {
    return res.status(400).json({ error: "'task' field is required" });
  }

  const newTodo = { id: todos.length + 1, task }; // Auto-ID with validated task
  todos.push(newTodo);

  res.status(201).json(newTodo); // Echo back the new todo
});


// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});


app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed); // filter where completed is false
  res.json(active); // return active todos
});


app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT  = process.env.PORT
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

