/** @format */

import "./reset.css";
import "./style.css";
import PubSub from "pubsub-js";
import format from "date-fns/format";
import App from "./app.js";
import DOM from "./DOM.js";

App.init();

let today = format(new Date(), "cccc, d");
DOM.init(today, App.getTodoList());

// NAVBAR
// -Hamburger menu click listener
DOM.navbar.hamburger.addEventListener("click", (e) => {
	PubSub.publish("hamClicked");
});

// -Search box
// --click listener
DOM.navbar.search.box.addEventListener("click", (e) => {
	DOM.navbar.search.box.classList.add("active");
	DOM.navbar.search.input.focus();
	PubSub.publish("searchFocused");
});

// --focusout listener
DOM.navbar.search.box.addEventListener("focusout", () => {
	let searchbox = DOM.navbar.search.box;
	searchbox.classList.remove("active");
	let input = searchbox.querySelector("input");
	input.value = "";
	PubSub.publish("searchFocusOut");
});

// -Change display state of Date
PubSub.subscribe("searchFocused", () => {
	DOM.navbar.date.classList.add("fade-out");
});

PubSub.subscribe("searchFocusOut", () => {
	DOM.navbar.date.classList.remove("fade-out");
});

// Container
DOM.mainArea.style.cssText = `--nav-height: calc(${DOM.navbar.self.offsetHeight}px)`;

// Event handlers
PubSub.subscribe("hamClicked", () => {
	DOM.navbar.hamburger.classList.toggle("active");
	if (DOM.navbar.hamburger.classList.contains("active")) {
		DOM.sidebar.self.classList.add("active");
	} else {
		DOM.sidebar.self.classList.remove("active");
	}
});
