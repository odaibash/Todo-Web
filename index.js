const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const { readJsonFile, writeJsonFile } = require('./fileOperations');
const app = express();
const usersFilePath = './users.json';
const todosFilePath = './todos.json';

app.use(express.static(path.join(__dirname, 'Client')));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

app.post('/register', (req, res) => {
    const { email, password, username } = req.body;
    const users = readJsonFile(usersFilePath);

    if (users.find(user => user.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = { email, password, username };
    users.push(newUser);
    writeJsonFile(usersFilePath, users);

    req.session.user = { email, username };
    res.json({ message: 'Registration successful!' });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const users = readJsonFile(usersFilePath);

    const user = users.find(user => user.email === email && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    req.session.user = { email: user.email, username: user.username };
    res.json({ username: user.username, email: user.email });
});

app.post('/todos', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const todos = readJsonFile(todosFilePath);
    const userTodos = todos[user.email] || [];
    userTodos.push(req.body.todo);
    todos[user.email] = userTodos;
    writeJsonFile(todosFilePath, todos);

    res.json({ message: 'Todo added successfully!' });
});

// app.get('/todos', (req, res) => {
//     const user = req.session.user;
//     if (!user) {
//         return res.status(401).json({ message: 'Unauthorized' });
//     }
//     const todos = readJsonFile(todosFilePath);
//     res.json({ todos: todos[user.email] || [] });
// });


app.get('/user', (req, res) => {
    const user = req.session.user;
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const todos = readJsonFile(todosFilePath)[user.email] || [];
    res.json({ username: user.username, email: user.email, todos });
});

app.get('/', (req, res) => {
    res.redirect('/login');
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client', 'LoginUser.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client', 'RegisterUser.html'));
});

app.get('/todos', (req, res) => {
    res.sendFile(path.join(__dirname, 'Client', 'todosUser.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));