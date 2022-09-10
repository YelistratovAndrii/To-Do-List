class Todo {
  constructor(selector) {
    this.el = document.querySelector(selector);
    this.form = this.el.querySelector('.form');
    this.input = this.el.querySelector('.form__input');
    this.addEdit = this.el.querySelector('.form__add-edit');
    this.list = this.el.querySelector('.todo-list');
    this.checkedArr = [...this.el.querySelectorAll('.todo-list__edit')];
    this.deleteArr = [...this.el.querySelectorAll('.todo-list__delete')];
    this.deleteAll = this.el.querySelector('.todo-result__delete-all');
    this.todos = localStorage.getItem('todos');
    this.#setup();
  }

  #setup() {
    document.addEventListener('DOMContentLoaded', this.renderList.bind(this));
    this.form && this.form.addEventListener('click', this.handleAddEdit.bind(this));
    this.list && this.list.addEventListener('click', this.handleList);
    this.deleteAll && this.deleteAll.addEventListener('click', this.handleDeleteAll.bind(this));
  }

  createTodo(name) {
    return { id: Date.now().toString(), name: name, checked: false, edited: false };
  }

  handleList(e) {
    const { target } = e;
    const todoId = target.parentElement.children[0].id;
    const conditions = ['todo-list__text', 'todo-list__edit', 'todo-list__delete'];

    if (!conditions.some((condition) => [...target.classList].includes(condition))) {
      return;
    }

    if (target.classList.contains('todo-list__text')) {
      target.classList.toggle('item-checked');
      todo.changeLocalChecked(todoId);
    }

    if (target.classList.contains('todo-list__edit')) {
      todo.edit(e, todoId);
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

  handleAddEdit(e) {
    e.preventDefault();
    const { target } = e;

    if (!target.classList.contains('form__add-edit')) {
      return;
    }

    if (target.dataset.action === `add`) {
      this.handleAdd();
    }

    if (target.dataset.action === `edit`) {
      this.handleEdit();
    }
  }

  handleAdd() {
    const value = this.input.value.trim();

    if (!value) {
      this.input.value = ``;
      this.input.focus();
      return;
    }

    this.saveLocal(this.createTodo(value));
    this.list.innerHTML += `
      <li>
        <span id=${this.todos[this.todos.length - 1].id} class="todo-list__text">
          ${value}
        </span>
        <button class="todo-list__edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button class="todo-list__delete"><i class="fa-solid fa-trash"></i></button>
      </li>
    `;
    this.input.value = ``;
  }

  edit(e, id) {
    const { target } = e;
    const textSpan = target.previousElementSibling;

    this.input.value = textSpan.textContent.trim();
    this.input.focus();
    this.addEdit.textContent = `Edit`;
    this.addEdit.dataset.action = `edit`;

    this.todos.forEach((obj) => {
      if (obj.id === id) {
        obj.edited = true;
      }
    });

    this.updateLocal();
  }

  handleEdit() {
    this.todos.forEach((obj) => {
      if (obj.edited) {
        obj.name = this.input.value;
      }
    });

    this.todos.forEach((obj) => {
      if (obj.edited) {
        obj.edited = false;
      }
    });

    this.updateLocal();
    this.renderList();
    this.input.value = ``;
    this.input.blur();

    this.addEdit.textContent = `Add`;
    this.addEdit.dataset.action = `add`;
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

    if (!this.todos.length) {
      this.list.innerHTML = ``;
      return;
    }

    this.list.innerHTML = ``;
    this.todos.forEach((todo) => {
      this.list.innerHTML += `
        <li>
          <span id=${todo.id} class="todo-list__text ${todo.checked ? 'item-checked' : ''}" >
           ${todo.name}
          </span>
          <button class="todo-list__edit"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="todo-list__delete"><i class="fa-solid fa-trash"></i></button>
        </li>
      `;
    });
  }

  checkTodos() {
    !localStorage.getItem('todos') ? (this.todos = []) : (this.todos = JSON.parse(localStorage.getItem('todos')));
  }

  handleDeleteAll() {
    this.todos = [];
    this.updateLocal();
    this.renderList();
  }
}

const todo = new Todo('.todo-container');
