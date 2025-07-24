import React, { useState, useEffect } from 'react';
import { Card, Typography, TextField, Button, List, ListItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data.filter(Boolean)))
  }, []);

  const addTask = () => {
    fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title })
    })
      .then(res => res.json())
      .then(task => setTasks(prev => [...prev.filter(Boolean), task]));
    setTitle('');
  };

  const toggleComplete = id => {
    const task = tasks.find(t => t._id === id);
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed })
    })
      .then(res => res.json())
      .then(updated => 
        setTasks(prev =>
          prev.map(t => (t && t._id === id ? updated : t)).filter(Boolean)
      )
    );
  };

  const deleteTask = id => {
    fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' })
      .then(() => 
        setTasks(prev => prev.filter(t => t && t._id !== id))
      );
  };

  return (
    <Card sx={{ maxWidth: 500, margin: '2rem auto', padding: '2rem' }}>
      <Typography variant="h4" align="center">Task Tracker</Typography>
      <form
        onSubmit={e => { e.preventDefault(); addTask(); }}
        style={{ display: 'flex', marginTop: '1rem' }}>
        <TextField
          fullWidth
          placeholder="New Task"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ marginLeft: 2 }}>
          Add
        </Button>
      </form>
  <List>
  {tasks
    .filter(task => task && task._id) // removes nullish or incomplete items
    .map(task => (
      <ListItem
        key={task._id}
        secondaryAction={
          <IconButton edge="end" onClick={(e) => {
            e.stopPropagation();
            deleteTask(task._id);
          }}>
            <DeleteIcon />
          </IconButton>
        }
        onClick={() => toggleComplete(task._id)}
        sx={{
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? 'gray' : 'black',
          cursor: 'pointer'
        }}
      >
        {task.title}
      </ListItem>
    ))}
</List>
</Card>
  );
}

export default App;
