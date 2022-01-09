/** @format */

import Todo from "./todo.js";
export { App as default };

const App = {
	init: function () {
		this.initTodoList();
	},
	createTodo: function (category, ...args) {
		// If there is no category provided, use default
		category = category ? category : "default";

		// If a category is provided and it does not exist, create an empty array
		if (this.todoList[category] == null) {
			this.todoList[category] = [];
		}

		// Create Todo instance
		let todo = new Todo(...args);
		todo.categories.push(category);

		// Push it to its category or default
		this.todoList[category].push(todo);

		// Update localStorage
		this.updateStorageTodoList();

		return todo;
	},
	deleteTodo: function (todo) {
		return;
	},
	getTodoList: function () {
		let todoList = localStorage.getItem("todoList");
		if (todoList) {
			return JSON.parse(todoList);
		} else {
			return false;
		}
	},
	initTodoList: function () {
		let todoList = this.getTodoList();
		if (todoList) {
			this.todoList = todoList;
		} else {
			this.todoList = {
				all: []
			};
			localStorage.setItem("todoList", JSON.stringify(this.todoList));
		}
	},
	updateStorageTodoList: function () {
		localStorage.setItem("todoList", JSON.stringify(this.todoList));
	}
};
