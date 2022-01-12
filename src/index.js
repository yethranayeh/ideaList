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
	filterClicked: "filterClicked",
	translationDone: "translationDone"
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
	} else {
		console.error("There was a problem while fetching translations for the local language.");
		console.log(
			"%cPlease contact %cgithub.com/yethranayeh",
			"font-size: 2em; color: #eee;",
			"font-size: 2em; color: blue; text-decoration: underline; font-weight: bold; cursor: pointer;"
		);
		return;
	}
}

// Replace the inner text of each element that has a
// data-i18n-key attribute with the translation corresponding
// to its data-i18n-key
function translatePage() {
	document.querySelectorAll("[data-key]").forEach(translateElement);
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
	let dateLocale;
	if (locale === "en" || !locale) {
		dateLocale = "en";
	} else if (locale === "tr") {
		dateLocale = "tr";
	}
	return format(new Date(), "cccc, d", { locale: dateLocale === "en" ? enUS : tr });
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

// SIDEBAR
// -All list items (tags and dates)
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

		PubSub.publish(E.filterClicked);
	});
}

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
	});
}

// -Language switch
DOM.sidebar.langInputs.forEach((input) => {
	input.addEventListener("change", (e) => {
		setLocale(e.target.id.split("-")[1]);
	});
});

// Main Content

// -Notes button (if todo element has notes)
DOM.main.self.querySelectorAll(".todo-note").forEach((note) => {
	note.addEventListener("click", (e) => {
		e.target.classList.add("active");
	});
});

// SUBSCRIBE EVENTS
PubSub.subscribe(E.translationDone, () => {
	// Change language of date display on navbar
	DOM.navbar.date.textContent = getToday();

	// Set language in local storage
	localStorage.setItem("TodoLanguage", locale);
});

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

PubSub.subscribe(E.filterClicked, () => {
	let actives = [...document.querySelectorAll(".tag.active")];
	let tags = [];
	actives.forEach((active) => {
		if (active.textContent === "All") {
			return;
		} else {
			tags.push(active.textContent);
		}
	});

	if (tags.length) {
		DOM.displayTodos(App.todoList.all, App.getFilteredTodos(tags, [], []));
	} else {
		DOM.displayTodos(App.todoList["all"]);
	}
});
