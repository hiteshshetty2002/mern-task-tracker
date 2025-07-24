const express = require('express');
const mongoose = require('mongoose');
const Task = require('./models/Task');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tasktracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to log every incoming request
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// API routes with logging

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    console.log(`Fetched ${tasks.length} tasks`);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const task = new Task({ title: req.body.title });
    await task.save();
    console.log(`Task created with id: ${task._id}`);
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { completed: req.body.completed },
      { new: true }
    );
    if (!task) {
      console.warn(`Task not found for update: id=${req.params.id}`);
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log(`Task updated: id=${task._id}, completed=${task.completed}`);
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      console.warn(`Task not found for deletion: id=${req.params.id}`);
      return res.status(404).json({ message: 'Task not found' });
    }
    console.log(`Task deleted: id=${req.params.id}`);
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));
