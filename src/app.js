/** @format */

import Todo from "./todo.js";
import isSameDay from "date-fns/isSameDay";
import isSameISOWeek from "date-fns/isSameISOWeek";
import isSameMonth from "date-fns/isSameMonth";
export { App as default };

const App = {
	init: function () {
		this.initTodoList();
	},
	createTodo: function (obj) {
		// Create Todo instance
		let todo = new Todo(obj);

		// Create an index for the todo instance, so it can be referenced from tags by its index position in "all" array
		// Index is created BEFORE adding it to the array because index references start from zero
		// so, it's easier to use current length rather than calculating index with `length - 1`
		todo.index = this.todoList["all"].length;

		// Add the todo object to "all"
		this.todoList["all"].push(todo);

		// If a tag is provided:
		if (obj.tags.length) {
			obj.tags.forEach((tag) => {
				// If it does not exist, create an empty array
				if (this.todoList[tag] == null) {
					this.todoList[tag] = [];
				}

				// Push its index to App's tag array
				this.todoList[tag].push(todo.index);
			});
		}

		// Update localStorage
		this.updateStorageTodoList();

		return todo;
	},
	/**
	 *
	 * @param {Number} index Index of the todo that will be updated
	 * @param {Object} properties New properties of the todo (e.g. { isComplete: true, priority: "!!"})
	 */
	updateTodo: function (index, properties) {
		let todo = App.todoList.all[index];
		let keys = Object.keys(properties);

		for (let key of keys) {
			todo[key] = properties[key];
		}

		App.updateStorageTodoList();
	},
	deleteTodo: function (index) {
		// Find every todo that meets todo.index > index and subtract 1 from their index
		// So, if index is 2, todos at 3, 4, 5 now become 2, 3, 4
		// Update both All and tags that contain the index.
		let todo = App.todoList.all[index];
		for (let tag of todo.tags) {
			let tagArr = App.todoList[tag];
			let tagIndex = tagArr.indexOf(Number(index));
			tagArr.splice(tagIndex, 1);
		}
		App.todoList.all.splice(index, 1);
		App.assignNewIndexes(index);
	},
	assignNewIndexes: function (deletedIndex) {
		// Starting from deleted index (as it is now replaced by the next Todo in array),
		// For each todo,
		// Update its index to n-1 in "All" and in its tag arrays if it has a tag
		for (let i = deletedIndex; i < App.todoList.all.length; i++) {
			let todo = App.todoList.all[i];
			todo.tags.forEach((tag) => {
				let arr = App.todoList[tag];
				arr[arr.indexOf(todo.index)]--;
			});
			todo.index--;
		}
		App.updateStorageTodoList();
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
	getFilteredTodos: function (obj) {
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
		if (obj.tags) {
			/**
			 * @property {String} tag Tag name provided to the filter.
			 */
			for (let tag of obj.tags) {
				/**
				 * @property {Number} index Index number of the object that contains the provided tag
				 * @property {Object} todo The Todo instance that corresponds to the index location in the array that contains "all" Todos.
				 */
				for (let index of this.todoList[tag]) {
					let todo = this.todoList["all"][index];
					//
					if (todo.tags.length < obj.tags.length) {
						continue;
					}

					// If the todo has more tags than the filter,
					if (obj.tags.length < todo.tags.length) {
						// check if the filter is a subset of todo tags
						if (obj.tags.every((val) => todo.tags.includes(val))) {
							// If its index is not already in filtered array, add it
							if (!filtered.includes(todo.index)) {
								filtered.push(todo.index);
							}
						}
					} else if (obj.tags.length === todo.tags.length) {
						// If the filter amount is the same as todo instance's tag amount, they must match to be displayed.
						if (arraysEqual(todo.tags, obj.tags)) {
							// If its index is not already in filtered array, add it
							if (!filtered.includes(todo.index)) {
								filtered.push(todo.index);
							}
						}
					}
				}
			}
		}

		// Apply the same logic to other filters
		// if date is provided:
		if (obj.date) {
			let date = new Date();
			let key = "date-filter-";
			let filteredDates = [];
			for (let todo of App.todoList.all) {
				let dueDate = new Date(todo.dueDate);
				if (obj.date === key + "day") {
					if (isSameDay(date, dueDate)) {
						filteredDates.push(todo.index);
					}
				} else if (obj.date === key + "week") {
					if (isSameISOWeek(date, dueDate)) {
						filteredDates.push(todo.index);
					}
				} else if (obj.date === key + "month") {
					if (isSameMonth(date, dueDate)) {
						filteredDates.push(todo.index);
					}
				}
			}
			if (filtered.length) {
				filtered = filteredDates.filter((value) => {
					return filtered.includes(value);
				});
			} else {
				filtered = filteredDates;
			}
		}

		// if completion filter is provided
		// compare with undefined since "completed" will be a boolean
		if (obj.completed != undefined) {
			let filteredChecked = [];
			for (let todo of App.todoList.all) {
				if (todo.isComplete === obj.completed) {
					filteredChecked.push(todo.index);
				}
			}
			if (filtered.length) {
				filtered = filteredChecked.filter((value) => {
					return filtered.includes(value);
				});
			} else {
				filtered = filteredChecked;
			}
		}
		console.log("Filtered after:", filtered);

		// filtered = filtered.length ? filtered : undefined;
		App.filtered = filtered;
		return filtered;
	},
	/**
	 *
	 * @param {RegExp} pattern A regular expression pattern to search for Todo titles.
	 */
	getSearchResults(pattern) {
		let filtered = App.filtered;

		let matching = [];
		// If there already filtered todos, go through them
		if (filtered) {
			for (let index of filtered) {
				let todo = App.todoList.all[index];
				if (pattern.test(todo.title)) {
					matching.push(index);
				}
			}
		} else {
			// If filtered array is empty, go through all todos
			for (let todo of App.todoList.all) {
				if (pattern.test(todo.title)) {
					matching.push(todo.index);
				}
			}
		}

		return matching;
	}
};
