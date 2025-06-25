const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')

const app = express();
const port = 3000;
const tagsData = require('./data/tags.json');
const columnsData = require('./data/columns.json');
let taskIdCounter = 1;

for(const col of columnsData) {
  taskIdCounter += col.tasks.length
}
// console.log(taskIdCounter)


app.use(bodyParser.json());
app.use('/', express.static(path.join(__dirname, '../frontend/dist')))

app.get('/api/counter', (req, res) => {
    res.status(200).json({
      taskIdCounter: taskIdCounter
    });
  });

app.get('/api/tags', (req, res) => {
    res.status(200).json(tagsData);
  });

app.get('/api/columns', (req, res) => {
    res.status(200).json(columnsData);
  });

app.post('/api/tasks', (req, res) => {
  const { column, title, text, taskTags } = req.body;
  

  const newTaskId = "t" + taskIdCounter;

  const newTask = {
    id: newTaskId,
    title: title,
    text: text ,
    tags: taskTags || [] 
  };
  const targetColumn = columnsData.find(col => col.id === column);

  targetColumn.tasks.push(newTask);
  res.status(201).json({
      id: newTaskId
  });
});


app.put('/api/tasks/:id', (req, res) => {
  const { title, text, taskTags } = req.body;
  const taskId = req.params.id;
  // console.log(req.body);

  for (const column of columnsData) {
    const targetTask = column.tasks.find(task => task.id === taskId);
    // console.log(targetTask);
    if (targetTask) {
      targetTask.title = title;
      targetTask.text = text;
      targetTask.tags = taskTags;
      // console.log(targetTask);
      return res.status(200).json({ message: 'Task updated successfully', task: targetTask });
    }
  }
  res.status(404).json({ message: 'Task not found' });
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = req.params.id;

  for (const column of columnsData) {
    // console.log(taskId);
    const taskIndex = column.tasks.findIndex(task => task.id === taskId);

    if (taskIndex !== -1) {
      column.tasks.splice(taskIndex, 1);
      return res.status(200).json({ message: 'Task deleted successfully' });
    }
  }

  res.status(404).json({ message: 'Task not found' });
});

app.put('/api/move-task/:id', (req, res) => {
  const taskId = req.params.id;
  const { newColumnId } = req.body;

  for (const column of columnsData) {
    const targetTaskIndex = column.tasks.findIndex(task => task.id === taskId);

    if (targetTaskIndex !== -1) {
      const targetTask = column.tasks[targetTaskIndex];
      const targetColumn = columnsData.find(col => col.id === newColumnId);

      if (targetColumn) {
        targetColumn.tasks.push(targetTask);
        column.tasks.splice(targetTaskIndex, 1);

        return res.status(200).json({ message: 'Task moved successfully' });
      } else {
        return res.status(404).json({ message: 'Target column not found' });
      }
    }
  }

  res.status(404).json({ message: 'Task not found' });
});


// start
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });