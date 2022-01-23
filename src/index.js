/** @format */

import "./reset.css";
import "./style.css";
import PubSub from "pubsub-js";
import format from "date-fns/format";
import { enUS, tr } from "date-fns/locale";
import enLocale from "./locales/en.json";
import trLocale from "./locales/tr.json";
import App from "./app.js";
import DOM from "./DOM.js";

// Event names
const E = {
	hamClicked: "hamClicked",
	searchFocused: "searchFocused",
	searchFocusOut: "searchFocusOut",
	searchChanged: "searchChanged",
	filterClicked: "filterClicked",
	translationDone: "translationDone",
	formSubmitted: "formSubmitted",
	newTagSubmitted: "newTagSubmitted",
	newTagValid: "newTagValid",
	newTagInvalid: "newTagInvalid",
	detailsClicked: "detailsClicked",
	todoCheckboxClicked: "todoCheckboxClicked",
	deleteBtnClicked: "deleteBtnClicked"
};

// Initialize
App.init();

// i18n
const storageLang = localStorage.getItem("TodoLanguage");
const defaultLocale = storageLang ? storageLang : "en";
// const supportedLocales = ["en", "tr"];
// const navigatorLang = navigator.language.split("-")[0];
let locale;
let translations = {};

// When the page content is ready...
document.addEventListener("DOMContentLoaded", () => {
	setLocale(defaultLocale);
});

setLocale(locale);

// Load translations for the given locale and translate
// the page to this locale
async function setLocale(newLocale) {
	if (newLocale === locale) return;
	const newTranslations = await fetchTranslationsFor(newLocale);
	locale = newLocale;
	translations = newTranslations;
	translatePage();
}

// Retrieve translations JSON object for the given
// locale over the network
async function fetchTranslationsFor(newLocale) {
	if (newLocale === "en") {
		return enLocale;
	} else if (newLocale === "tr") {
		return trLocale;
	}
}

// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
	DOM.body.querySelectorAll("[data-key]").forEach(translateElement);
	DOM.body.querySelectorAll("[data-dueDate]").forEach((element) => {
		let date = new Date(element.getAttribute("data-dueDate"));
		element.textContent = format(date, "d MMMM, HH:mm", {
			locale: getLocale() === "en" ? enUS : tr
		});
	});
}

// Replace the inner text of the given HTML element
// with the translation in the active locale,
// corresponding to the element's data-i18n-key
function translateElement(element) {
	const key = element.getAttribute("data-key");
	const translation = translations[key];
	element.innerText = translation;
	PubSub.publish(E.translationDone);
}

// Get locale language formatted Today
function getToday() {
	// format() is a date-fns function
	return format(new Date(), "cccc, d", { locale: getLocale() === "en" ? enUS : tr });
}

function getLocale() {
	let dateLocale;
	if (locale === "en" || !locale) {
		dateLocale = "en";
	} else if (locale === "tr") {
		dateLocale = "tr";
	}
	return dateLocale;
}

let today = getToday();
DOM.init(today, App.getTodoList());

// Nav height variable to calculate the height of navbar and how much distance other elements need.
DOM.mainArea.style.cssText = `--nav-height: calc(${DOM.navbar.self.offsetHeight}px)`;

// Event Listeners and Publish Events

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

// --change listener
DOM.navbar.search.input.addEventListener("input", (e) => {
	PubSub.publish(E.searchChanged, e.target.value);
});

DOM.navbar.search.input.addEventListener("keydown", (event) => {
	if (event.key === "Enter") {
		event.preventDefault();
	}
});

// SIDEBAR
// -All list items (tags, dates, completion)
DOM.sidebar.addEventListenerTags = function () {
	for (let each of DOM.sidebar.tags) {
		each.addEventListener("click", (event) => {
			let All = DOM.sidebar.self.querySelector("#filterAll");
			// If "All" filter is clicked
			if (event.target.id === All.id) {
				DOM.sidebar.tags.forEach((tag) => {
					// Remove active from every filter except "All"
					if (!(tag.id === All.id)) {
						tag.classList.remove("active");
					} else {
						tag.classList.add("active");
					}
				});
			} else {
				// If any filter other than "All" is clicked

				// If "All" is active, remove it because any other filter will contain less than all todo elements
				if (All.classList.contains("active")) {
					All.classList.remove("active");
				}
				each.classList.toggle("active");
			}

			PubSub.publish(E.filterClicked, "tag");
		});
	}
};
DOM.sidebar.addEventListenerTags();

for (let each of DOM.sidebar.dates) {
	each.addEventListener("click", () => {
		// For each date filter, if it is not the currently clicked one, remove its "active" class
		DOM.sidebar.dates.forEach((date) => {
			if (each != date) {
				date.classList.remove("active");
			}
		});

		// Toggle "active" class of clicked element
		each.classList.toggle("active");
		PubSub.publish(E.filterClicked, "date");
	});
}

for (let each of DOM.sidebar.comps) {
	each.addEventListener("click", () => {
		DOM.sidebar.comps.forEach((comp) => {
			if (each != comp) {
				comp.classList.remove("active");
			}
		});

		// Toggle "active" class of clicked element
		each.classList.toggle("active");
		PubSub.publish(E.filterClicked, "completion");
	});
}

// -Language switch
DOM.sidebar.langInputs.forEach((input) => {
	input.addEventListener("change", (e) => {
		setLocale(e.target.id.split("-")[1]);
	});
});

// Main Content

// -Create new Todo
DOM.newTodoBtn.addEventListener("click", (e) => {
	DOM.newTodoElementsToggle();
});

// -Close new Todo form
DOM.newTodoForm.btnClose.addEventListener("click", (e) => {
	DOM.newTodoElementsToggle();
});

// -Toggle visibility of tags
DOM.newTodoForm.btnShowTags.addEventListener("click", () => {
	let container = DOM.newTodoForm.self.querySelector("#form-tags");
	container.classList.toggle("visible");
});

// -New tag input & button
DOM.newTodoForm.newTag.input.addEventListener("keydown", (event) => {
	DOM.newTodoForm.newTag.limitInput(event.target);
	if (event.key === "Enter") {
		event.preventDefault();
	}
});

DOM.newTodoForm.newTag.input.addEventListener("keyup", (event) => {
	DOM.newTodoForm.newTag.limitInput(event.target);
	// input must be >= 2 characters, no whitespace at beginning, cannot start with all
	let passesTest = DOM.newTodoForm.newTag.passesTest();
	if (event.key === "Backspace") {
		// If new tag has input value, send signal so button can be changed from chevron to plus
		if (passesTest) {
			PubSub.publish(E.newTagValid);
		} else {
			PubSub.publish(E.newTagInvalid);
		}
	} else if (event.key === "Enter") {
		event.preventDefault();

		if (passesTest) {
			PubSub.publish(E.newTagSubmitted, event.target.value);
		}
	} else if (passesTest) {
		PubSub.publish(E.newTagValid);
	} else if (!passesTest) {
		PubSub.publish(E.newTagInvalid);
	}
});

DOM.newTodoForm.newTag.btn.addEventListener("click", (event) => {
	let input = DOM.newTodoForm.newTag.input;
	let passesTest = DOM.newTodoForm.newTag.passesTest();
	if (event.target.classList.contains("valid") && passesTest) {
		PubSub.publish(E.newTagSubmitted, input.value);
	}
});

// -Submit new Todo form
DOM.newTodoForm.btnAdd.addEventListener("click", (e) => {
	PubSub.publish(E.formSubmitted);
});

// -New Todo Form on submit
DOM.newTodoForm.self.addEventListener("submit", (e) => {
	e.preventDefault();
});

// -Todo details
DOM.todos.addEventListener = function () {
	DOM.todos.detailsList.forEach((btn) => {
		btn.addEventListener("click", (event) => {
			PubSub.publish(E.detailsClicked, event.target);
		});
	});

	DOM.todos.checkboxList.forEach((checkbox) => {
		checkbox.addEventListener("click", (event) => {
			PubSub.publish(E.todoCheckboxClicked, event.target);
		});
	});

	DOM.todos.deleteBtnsList.forEach((btn) => {
		btn.addEventListener("click", (event) => {
			PubSub.publish(E.deleteBtnClicked, event.target);
		});
	});
};
DOM.todos.addEventListener();

// SUBSCRIBE EVENTS

// Translation
PubSub.subscribe(E.translationDone, () => {
	// Change language of date display on navbar
	DOM.navbar.date.textContent = getToday();

	// Set language in local storage
	localStorage.setItem("TodoLanguage", locale);
});

// Hamburger Menu
PubSub.subscribe(E.hamClicked, () => {
	DOM.navbar.hamburger.classList.toggle("active");
	if (DOM.navbar.hamburger.classList.contains("active")) {
		DOM.sidebar.self.classList.add("active");
	} else {
		DOM.sidebar.self.classList.remove("active");
	}
});

// Search Box
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

PubSub.subscribe(E.searchChanged, (event, input) => {
	let re = new RegExp(`^${input}`, "i");
	DOM.displayTodos(App.todoList.all, App.getSearchResults(re));
	DOM.todos.addEventListener();
});

// Filters
PubSub.subscribe(E.filterClicked, (sender, data) => {
	let actives = [...DOM.sidebar.self.querySelectorAll(".active")];
	let activeTags = actives.filter((value) => {
		return value.classList.contains("tag");
	});
	let activeDate = actives.filter((value) => {
		return value.classList.contains("date");
	});
	let activeCompletion = actives.filter((value) => {
		return value.classList.contains("completion");
	});

	let filter = {};

	if (data === "date" && activeTags.length === 1 && activeTags[0].id === "filterAll") {
		App.filtered = undefined;
	}

	let tags = [];
	activeTags.forEach((tag) => {
		if (tag.id === "filterAll") {
			return;
		} else {
			tags.push(tag.textContent);
		}
	});

	if (tags.length) {
		filter.tags = tags;
	}

	if (activeDate.length) {
		filter.date = activeDate[0].querySelector("span").getAttribute("data-key");
	}

	if (activeCompletion.length) {
		let key = activeCompletion[0].querySelector("span").getAttribute("data-key");
		let prefix = "filter-";
		if (key === prefix + "completed") {
			filter.completed = true;
		} else if (key === prefix + "in-progress") {
			filter.completed = false;
		}
	}

	// If filter has any keys, get the filtered result
	if (Object.keys(filter).length) {
		DOM.displayTodos(App.todoList.all, App.getFilteredTodos(filter));
	} else {
		// Else, show all todos
		DOM.displayTodos(App.todoList["all"]);
		App.filtered = undefined;
	}
	DOM.todos.addEventListener();
});

// New Todo Form
PubSub.subscribe(E.formSubmitted, () => {
	if (DOM.newTodoForm.isValid()) {
		let inputs = DOM.newTodoForm.getFormInputs();
		DOM.newTodoElementsToggle();
		DOM.newTodoForm.resetForm();
		let todo = App.createTodo(inputs);
		DOM.displayTodos(App.todoList["all"]);
		DOM.todos.addEventListener();
		DOM.sidebar.populateFilterTags(App.todoList);
		// Since sidebar filter tags are removed and added again, they lose event listeners.
		DOM.sidebar.addEventListenerTags();
		DOM.newTodoForm.populateFormTags(App.todoList);
	}
});

PubSub.subscribe(E.newTagValid, () => {
	let btn = DOM.newTodoForm.newTag.btn;
	btn.classList.remove("fa-chevron-down");
	btn.classList.add("fa-plus");
	btn.classList.add("valid");
});

PubSub.subscribe(E.newTagInvalid, () => {
	let btn = DOM.newTodoForm.newTag.btn;
	btn.classList.remove("fa-plus");
	btn.classList.remove("valid");
	btn.classList.add("fa-chevron-down");
});

PubSub.subscribe(E.newTagSubmitted, (topic, data) => {
	DOM.newTodoForm.newTag.addCreatedTag();
	DOM.newTodoForm.newTag.input.value = "";
});

// Todos
PubSub.subscribe(E.detailsClicked, (topic, data) => {
	let icon = data.querySelector("i");
	icon.classList.toggle("active");

	let container = data.parentNode.parentNode;

	let info = container.querySelector(".todo-info");
	info.classList.toggle("visible");

	let btnDelete = container.parentNode.querySelector(".btn-delete-todo");
	btnDelete.classList.toggle("visible");
});

PubSub.subscribe(E.todoCheckboxClicked, (topic, data) => {
	let todo = data.parentNode.parentNode.parentNode;
	App.updateTodo(todo.getAttribute("data-index"), { isComplete: data.checked });
});

PubSub.subscribe(E.deleteBtnClicked, (topic, data) => {
	let todo = data.parentNode.parentNode;
	// Send actual element height to css before transition so it is smooth.
	todo.style.cssText = `--height: ${todo.offsetHeight}px`;

	let index = todo.getAttribute("data-index");

	// Play the animation, after it ends remove the todo from everywhere.
	todo.classList.add("fade-out");
	todo.addEventListener("animationend", () => {
		App.deleteTodo(index);
		DOM.updateIndexes(index);
	});
});
