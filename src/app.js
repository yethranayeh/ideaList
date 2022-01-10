/** @format */

import Todo from "./todo.js";
export { App as default };

const App = {
	init: function () {
		this.initTodoList();
	},
	createTodo: function (tags, ...args) {
		// Create Todo instance
		let todo = new Todo(...args);

		// If a tag is provided:
		if (tags) {
			tags.forEach((tag) => {
				// If it does not exist, create an empty array
				if (this.todoList[tag] == null) {
					this.todoList[tag] = [];
				}

				// Add tag to instance's tags array
				todo.tags.push(tag);

				// Push it to App's tag array
				this.todoList[tag].push(todo);
			});
		}

		// Also add it to "all"
		this.todoList["all"].push(todo);

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
	},
	fetchTodos: function (...todos) {
		if (todos) {
			todos.forEach((todo) => {
				return;
			});
		}
	}
};
