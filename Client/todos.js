document.addEventListener('DOMContentLoaded', function () {
    const user = JSON.parse(sessionStorage.getItem('user'));
    if (!user) {
        window.location.href = '/login';
        return;
    }

    const usernameElement = document.getElementById('username');
    const emailElement = document.getElementById('email');
    const todosDiv = document.getElementById('todos');
    const todoForm = document.getElementById('todoForm');
    const saveButton = document.getElementById('save');
    const logoutButton = document.getElementById('logout');

    // Display user information
    usernameElement.textContent = user.username;
    emailElement.textContent = user.email;

    // Function to fetch user data and todos from the server
    async function fetchUserData() {
        try {
            const response = await fetch('/user');
            const data = await response.json();
            if (response.ok) {
                displayTodos(data.todos);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    // Function to display todos on the UI
    function displayTodos(todos) {
        todosDiv.innerHTML = '';
        todos.forEach(todo => {
            const todoItem = document.createElement('div');
            todoItem.textContent = '- ' + todo.text;
            if (todo.completed) {
                todoItem.classList.add('completed');
            }
            todosDiv.appendChild(todoItem);
        });
    }

    // Function to add a new todo
    async function addTodo(todoText) {
        try {
            const response = await fetch('/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ todo: { text: todoText, completed: false } })
            });
            const data = await response.json();
            if (response.ok) {
                fetchUserData();
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    }

    // Function to save todos to the server
    async function saveTodos() {
        const todos = [];
        todosDiv.childNodes.forEach(todoItem => {
            todos.push({ text: todoItem.textContent, completed: todoItem.classList.contains('completed') });
        });

        try {
            const response = await fetch('/todos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ todos })
            });
            const data = await response.json();
            if (response.ok) {
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error saving todos:', error);
        }
    }

    // Event listener for todo form submission
    todoForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const todoText = todoForm.elements['todo'].value.trim();
        if (todoText) {
            addTodo(todoText);
            todoForm.reset();
        }
    });

    // Event listener for save button click
    saveButton.addEventListener('click', function () {
        saveTodos();
    });

    // Event listener for logout button click
    logoutButton.addEventListener('click', function () {
        sessionStorage.clear();
        window.location.href = '/login';
    });

    // Fetch user data and todos when the page loads
    fetchUserData();
});