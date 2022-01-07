/** @format */

import "./reset.css";
import "./style.css";
import PubSub from "pubsub-js";
import App from "./app.js";
import DOM from "./DOM.js";

App.initTodoList();
DOM.init();

DOM.navbar.hamburger.addEventListener("click", (e) => {
	DOM.navbar.hamburger.classList.toggle("active");
	if (DOM.navbar.hamburger.classList.contains("active")) {
		console.count("active");
	} else {
		console.count("not active");
	}
});
