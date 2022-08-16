class Todo {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.input = this.el.querySelector('.form__input');
    this.add = this.el.querySelector('.form__edit');
    this.list = this.el.querySelector('.todo-list');
    this.checkedArr = [...this.el.querySelectorAll('.todo-list__checked')];
    this.deleteArr = [...this.el.querySelectorAll('.todo-list__delete')];
    this.deleteAll = this.el.querySelector('.todo-result__delete-all');
    this.todos = localStorage.getItem('todos');
    this.#setup();
  }

  #setup() {
    document.addEventListener('DOMContentLoaded', this.renderList.bind(this));
    this.add && this.add.addEventListener('click', this.handleAdd.bind(this));
    this.list && this.list.addEventListener('click', this.handleList);
    this.deleteAll && this.deleteAll.addEventListener('click', this.handleDeleteAll.bind(this));
  }

  handleAdd(e) {
    e.preventDefault();

    const value = this.input.value.trim();

    if (value === ``) return;

    this.saveLocal(this.createTodo(value));
    this.list.innerHTML += `
      <li>
        <span id=${this.todos[this.todos.length - 1].id} class="todo-list__span">${value}</span>
        <button class="todo-list__checked"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="todo-list__delete"><i class="fa-solid fa-trash"></i></button>
      </li>
    `;
    this.input.value = ``;
  }

  createTodo(name) {
    return { id: Date.now().toString(), name: name, checked: false };
  }

  handleList(e) {
    const { target } = e;
    const todoId = target.parentElement.children[0].id;

    if (!target.classList.contains('todo-list__checked') && !target.classList.contains('todo-list__delete')) {
      return;
    }

    if (target.classList.contains('todo-list__checked')) {
      target.previousElementSibling.classList.toggle('_checked');
      todo.changeLocalChecked(todoId);
    }

    if (target.classList.contains('todo-list__delete')) {
      todo.deleteLocal(todoId);
      target.parentElement.remove();
    }
  }

  updateLocal() {
    localStorage.setItem('todos', JSON.stringify(this.todos));
  }

  saveLocal(todo) {
    this.todos.push(todo);
    this.updateLocal();
  }

  changeLocalChecked(id) {
    this.todos.forEach((obj) => {
      if (obj.id === id) {
        obj.checked = !obj.checked;
      }
    });

    this.updateLocal();
  }

  deleteLocal(id) {
    this.todos.forEach((obj) => {
      if (obj.id === id) {
        this.todos.splice(this.todos.indexOf(obj), 1);
      }
    });

    this.updateLocal();
  }

  renderList() {
    this.checkTodos();

    if (this.todos.length < 1) return;

    this.list.innerHTML = ``;
    this.todos.forEach((todo) => {
      this.list.innerHTML += `
        <li>
          <span id=${todo.id} class="todo-list__span ${todo.checked ? '_checked' : ''}">${todo.name}</span>
          <button class="todo-list__checked"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="todo-list__delete"><i class="fa-solid fa-trash"></i></button>
        </li>
      `;
    });
  }

  checkTodos() {
    !localStorage.getItem('todos') ? (this.todos = []) : (this.todos = JSON.parse(localStorage.getItem('todos')));
  }

  handleDeleteAll() {
    this.todos = this.todos.filter((obj) => obj.checked === false);
    this.updateLocal();
    this.renderList();
  }
}

const todo = new Todo('.todo-container');
