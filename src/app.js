/** @format */

import Todo from "./todo.js";
export { App as default };

const App = {
	createTodo: function (category, ...args) {
		// If there is no category provided, use default
		category = category ? category : "default";

		// If a category is provided and it does not exist, create an empty array
		if (this.todoList[category] == null) {
			this.todoList[category] = [];
		}

		// Create Todo instance
		let todo = new Todo(...args);
		todo.category = category;

		// Push it to its category or default
		this.todoList[category].push(todo);

		// Update localStorage
		this.updateStorageTodoList();

		return todo;
	},
	deleteTodo: function (todo) {
		return;
	},
	initTodoList: function () {
		let todoList = localStorage.getItem("todoList");
		if (todoList) {
			this.todoList = JSON.parse(todoList);
		} else {
			this.todoList = {
				default: []
			};
			localStorage.setItem("todoList", JSON.stringify(this.todoList));
		}
	},
	updateStorageTodoList: function () {
		localStorage.setItem("todoList", JSON.stringify(this.todoList));
	}
};
