const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {

  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(404).json({ error: 'User not found!' });
  }

  request.user = user;

  return next();

}

// create users - complete
app.post('/users', (request, response) => {

  const { name, username } = request.body;

  const userAlreadyExists = users.find((user) => user.username === username);

  if (userAlreadyExists) {
    return response.status(400).json({ error: 'User already exists!' });
  }

  const userCreate = {
    name,
    username,
    id: uuidv4(),
    todos: [],
  };

  users.push(userCreate);

  return response.status(201).json(userCreate);

});

// list todos - complete
app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { user } = request;

  return response.json(user.todos);

});

// create todo - complete
app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;

  const { user } = request;

  const toDos = user.todos;

  const toDo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  toDos.push(toDo);

  return response.status(201).json(toDo);

});

// update todo - complete
app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { id } = request.params;
  const { title, deadline } = request.body;
  const { user } = request;

  const todos = user.todos;
  const todo = todos.find((todos) => todos.id === id);

  if (!todo) {
    return response.status(404).json({ error: 'ToDo not found!' });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);

});

// done todo - complete
app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { id } = request.params;
  const { user } = request;

  const todos = user.todos;
  const todo = todos.find((todos) => todos.id === id);

  if (!todo) {
    return response.status(404).json({ error: 'ToDo not found!' });
  }

  todo.done = true;

  return response.status(201).json(todo);

});

// delete todo - complete
app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {

  const { id } = request.params;
  const { user } = request;

  const todos = user.todos;
  const todo = todos.find((todos) => todos.id === id);

  if (!todo) {
    return response.status(404).json({ error: 'ToDo not found!' });
  }

  todos.splice(todo, 1);

  return response.status(204).send();

});

module.exports = app;