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

		// Create an index for the todo instance, so it can be referenced from tags by its index position in "all" array
		// Index is created BEFORE adding it to the array because index references start from zero
		// so, it's easier to use current length rather than calculating index with `length - 1`
		todo.index = this.todoList["all"].length;

		// Add the todo object to "all"
		this.todoList["all"].push(todo);

		// If a tag is provided:
		if (tags) {
			tags.forEach((tag) => {
				// If it does not exist, create an empty array
				if (this.todoList[tag] == null) {
					this.todoList[tag] = [];
				}

				// Add tag to instance's tags array
				todo.tags.push(tag);

				// Push its index to App's tag array
				this.todoList[tag].push(todo.index);
			});
		}

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
	/**
	 * @param {Array} tags Tag(s) of the Todo instance [optional filter]
	 * @param {dateFns} date The date filter [optional filter]
	 * @param {Boolean} completed Filter completed/uncompleted todos [optional filter]
	 */
	getFilteredTodos: function (tags, date, completed) {
		function arraysEqual(arr1, arr2) {
			let arr1Sorted = arr1;
			arr1Sorted.sort();

			let arr2Sorted = arr2;
			arr2Sorted.sort();

			if (arr1Sorted === arr2Sorted) return true;
			if (arr1Sorted == null || arr2Sorted == null) return false;
			if (arr1Sorted.length !== arr2Sorted.length) return false;

			for (var i = 0; i < arr1Sorted.length; ++i) {
				if (arr1Sorted[i] !== arr2Sorted[i]) return false;
			}
			return true;
		}

		// Only append indexes to filtered Array, as it is easier to check if it is already in the list and also easier to find by index number to display.
		let filtered = [];

		// if tags are provided:
		if (tags.length) {
			// Check each todo
			for (let todo of this.todoList["all"]) {
				// Check that todo matches the provided tag(s)
				if (arraysEqual(todo.tags, tags)) {
					// If its index is not already in filtered array, add it
					if (!filtered.includes(todo.index)) {
						filtered.push(todo.index);
					}
				}
			}
		}

		// Apply the same logic to other filters

		// if date is provided:
		if (date.length) {
		}

		// if completion filter is provided
		// compare with undefined since "completed" will be a boolean
		if (completed != undefined) {
		}

		return filtered;
	}
};
