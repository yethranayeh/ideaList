/** @format */

import Todo from "./todo.js";
export { App as default };

const App = {
	init: function () {
		this.DOM = document.querySelector("body");
	},
	createTodo: function (...args) {
		return new Todo(...args);
	},
	markAsComplete: function (todo) {
		todo.isComplete = true;
	}
};
