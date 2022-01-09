/** @format */

import "./reset.css";
import "./style.css";
import PubSub from "pubsub-js";
import format from "date-fns/format";
import App from "./app.js";
import DOM from "./DOM.js";

// Initialize
App.init();

let today = format(new Date(), "cccc, d");
DOM.init(today, App.getTodoList());

// Nav height variable to calculate the height of navbar and how much distance other elements need.
DOM.mainArea.style.cssText = `--nav-height: calc(${DOM.navbar.self.offsetHeight}px)`;

// Event Listeners and Publish Events
// Event names
const E = {
	hamClicked: "hamClicked",
	searchFocused: "searchFocused",
	searchFocusOut: "searchFocusOut"
};

// NAVBAR
// -Hamburger menu click listener
DOM.navbar.hamburger.addEventListener("click", (e) => {
	PubSub.publish(E.hamClicked);
});

// -Search box
// --click listener
DOM.navbar.search.box.addEventListener("click", (e) => {
	DOM.navbar.search.box.classList.add("active");
	DOM.navbar.search.input.focus();
	PubSub.publish(E.searchFocused);
});

// --focusout listener
DOM.navbar.search.box.addEventListener("focusout", () => {
	let searchbox = DOM.navbar.search.box;
	searchbox.classList.remove("active");
	let input = searchbox.querySelector("input");
	input.value = "";
	PubSub.publish(E.searchFocusOut);
});

// SIDEBAR
// -All list items (categories and dates)
for (let each of [...DOM.sidebar.dates, ...DOM.sidebar.categories]) {
	each.addEventListener("click", function () {
		each.classList.toggle("active");
	});
}

// SUBSCRIBE EVENTS

PubSub.subscribe(E.hamClicked, () => {
	DOM.navbar.hamburger.classList.toggle("active");
	if (DOM.navbar.hamburger.classList.contains("active")) {
		DOM.sidebar.self.classList.add("active");
	} else {
		DOM.sidebar.self.classList.remove("active");
	}
});

PubSub.subscribe(E.searchFocused, () => {
	// Change display state of Date in Navbar
	DOM.navbar.date.classList.add("fade-out");

	// Close sidebar if it is opened and return hamburger to initial state
	DOM.sidebar.self.classList.remove("active");
	DOM.navbar.hamburger.classList.remove("active");
});

PubSub.subscribe(E.searchFocusOut, () => {
	// Change display state of Date in Navbar
	DOM.navbar.date.classList.remove("fade-out");
});
