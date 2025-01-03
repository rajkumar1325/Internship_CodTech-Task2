

class TodoApp {
    constructor() {
        this.todos = JSON.parse(sessionStorage.getItem('todos')) || [];
        this.todoInput = document.getElementById('todo-input');
        this.todoList = document.getElementById('todo-list');
        this.timestamp = document.querySelector('.timestamp');
        this.updateTimestamp();
        this.initializeEventListeners();
        this.renderTodos();
        setInterval(() => this.updateTimestamp(), 1000);
    }

    updateTimestamp() {
        const now = new Date();
        this.timestamp.textContent = now.toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });
    }

    initializeEventListeners() {
        document.getElementById('add-btn').addEventListener('click', () => this.addTodo());
        this.todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTodo();
        });
    }

    addTodo() {
        const todoText = this.todoInput.value.trim();
        if (todoText) {
            const todo = {
                id: Date.now(),
                text: todoText,
                completed: false
            };
            this.todos.push(todo);
            this.saveTodos();
            this.renderTodos();
            this.todoInput.value = '';
        }
    }

    toggleTodo(id) {
        this.todos = this.todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        this.saveTodos();
        this.renderTodos();
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.renderTodos();
    }

    saveTodos() {
        sessionStorage.setItem('todos', JSON.stringify(this.todos));
    }

    renderTodos() {
        this.todoList.innerHTML = this.todos
            .map(todo => `
                <div class="todo-item ${todo.completed ? 'completed' : ''}">
                    <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                    <button class="btn complete-btn" onclick="todoApp.toggleTodo(${todo.id})">✓</button>
                    <button class="btn delete-btn" onclick="todoApp.deleteTodo(${todo.id})">×</button>
                </div>
            `)
            .join('');
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

const todoApp = new TodoApp();
