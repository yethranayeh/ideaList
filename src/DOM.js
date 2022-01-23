/** @format */

import flatpickr from "flatpickr";
import { Turkish } from "flatpickr/dist/l10n/tr.js";
require("flatpickr/dist/themes/dark.css");
import format from "date-fns/format";
import { enUS, tr } from "date-fns/locale";

export { DOM as default };

function getLocale() {
	let locale = localStorage.getItem("TodoLanguage");
	locale = locale ? locale : "en";
	return locale;
}

const DOM = {
	/**
	 *
	 * @param {String} date date-fns formatted date of <today>
	 * @param {Object} todoList App.todoList object that contains all locally stored Todo instances
	 */
	init: function (date, todoList, format) {
		this.body = document.querySelector("body");
		this.contentArea = this.body.querySelector("#content");

		// Navbar
		this.navbar.date.textContent = date;
		this.contentArea.appendChild(this.navbar.self);

		// Main area
		this.mainArea = document.createElement("div");
		this.mainArea.classList.add("container");
		this.contentArea.appendChild(this.mainArea);

		// Sidebar
		this.sidebar = this.sidebar(todoList);
		this.mainArea.appendChild(this.sidebar.self);

		// Main Content
		// - Create Todo Form
		this.mainArea.appendChild(this.newTodoForm.self);
		let formMaxHeight = this.newTodoForm.self.offsetHeight + 16 * 10;
		this.newTodoForm.self.style.cssText = `--max-height: ${formMaxHeight}px; --min-height: 0px`;
		this.newTodoForm.populateFormTags(todoList);

		// -Create Todo Button
		this.mainArea.appendChild(this.newTodoBtn);
		// -Main container (lists todos)
		this.mainArea.appendChild(this.main.self);

		// Display ALL Todos on page initialization
		this.displayTodos(todoList["all"]);
	},
	initInterface: function () {
		return;
	},
	navbar: (function () {
		const navbar = document.createElement("nav");

		// Hamburger
		const hamburger = (function () {
			const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
			svg.classList.add("ham", "hamRotate", "ham4");
			svg.setAttribute("viewBox", "0 0 100 100");
			svg.setAttribute("width", "80");

			// Hamburger paths
			const classes = ["top", "middle", "bottom"];
			const dAttr = [
				"m 70,33 h -40 c 0,0 -8.5,-0.149796 -8.5,8.5 0,8.649796 8.5,8.5 8.5,8.5 h 20 v -20",
				"m 70,50 h -40",
				"m 30,67 h 40 c 0,0 8.5,0.149796 8.5,-8.5 0,-8.649796 -8.5,-8.5 -8.5,-8.5 h -20 v 20"
			];
			for (let i = 0; i < 3; i++) {
				let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
				path.classList.add("line", classes[i]);
				path.setAttribute("d", dAttr[i]);
				svg.appendChild(path);
			}
			return svg;
		})();

		// Date
		const date = (function () {
			const today = document.createElement("span");
			today.classList.add("display-date", "disable-select");

			return today;
		})();

		// Search Button
		const search = (function () {
			const searchBox = document.createElement("div");
			searchBox.classList.add("search-box");

			const form = document.createElement("form");
			form.setAttribute("name", "search");

			const input = document.createElement("input");
			input.classList.add("input");
			input.setAttribute("type", "text");
			input.setAttribute("name", "txt");
			form.appendChild(input);
			searchBox.appendChild(form);

			const btn = document.createElement("i");
			btn.classList.add("fas", "fa-search");
			searchBox.appendChild(btn);

			return { box: searchBox, button: btn, input: input };
		})();

		navbar.appendChild(hamburger);
		navbar.appendChild(date);
		navbar.appendChild(search.box);

		return { self: navbar, hamburger: hamburger, date: date, search: search };
	})(),
	sidebar: function (todoList) {
		const aside = document.createElement("aside");

		// Start with active class for faster debug
		// aside.classList.add("active");

		// Wrap each part in a section tag before adding to sidebar
		function addToSection(...elements) {
			let section = document.createElement("section");
			section.classList.add("disable-select");

			for (let element of elements) {
				section.appendChild(element);
			}
			return section;
		}

		// Filters
		const filters = document.createElement("div");

		// Start: Tag Filters
		const tagsHeader = document.createElement("h2");
		tagsHeader.setAttribute("data-key", "tags-header");

		const tagList = document.createElement("ul");
		const tags = [];
		function populateFilterTags(todoList) {
			tagList.innerHTML = "";
			for (let key in todoList) {
				let li = document.createElement("li");
				li.classList.add("tag");
				let icon = document.createElement("i");
				icon.classList.add("fas", "fa-hashtag");
				li.appendChild(icon);

				if (key === "all") {
					li.id = "filterAll";
					li.classList.add("active");

					let text = document.createElement("span");
					text.setAttribute("data-key", "tag-all");
					text.textContent = getLocale() === "en" ? "All" : "Hepsi";

					li.appendChild(text);
				} else {
					li.innerHTML += key;
				}
				tagList.appendChild(li);
				tags.push(li);
			}
		}
		populateFilterTags(todoList);
		let tagContent = addToSection(tagsHeader, tagList);
		filters.appendChild(tagContent);
		// End: Tag Filters

		// Start: Date Filters
		const dateHeader = document.createElement("h2");
		dateHeader.setAttribute("data-key", "date-header");

		const dateIconClasses = ["-day", "-week", ""];
		const dateDataKeys = ["day", "week", "month"];
		const dateList = document.createElement("ul");
		const dates = [];
		for (let i = 0; i < 3; i++) {
			let li = document.createElement("li");
			li.classList.add("date");

			let liIcon = document.createElement("i");
			liIcon.classList.add("fas", `fa-calendar${dateIconClasses[i]}`);
			li.appendChild(liIcon);

			let liText = document.createElement("span");
			liText.setAttribute("data-key", `date-filter-${dateDataKeys[i]}`);
			li.appendChild(liText);

			dateList.appendChild(li);
			dates.push(li);
		}
		const dateContent = addToSection(dateHeader, dateList);
		filters.appendChild(dateContent);
		// End: Date Filters

		// Start: Completion Filters
		const compHeader = document.createElement("h2");
		compHeader.setAttribute("data-key", "completion-header");
		const compIcons = ["check", "spinner"];
		const compKeys = ["completed", "in-progress"];
		const compList = document.createElement("ul");
		const comps = [];
		for (let i = 0; i < compIcons.length; i++) {
			let li = document.createElement("li");
			li.classList.add("completion");

			let liIcon = document.createElement("i");
			liIcon.classList.add("fas", `fa-${compIcons[i]}`);
			li.appendChild(liIcon);

			let text = document.createElement("span");
			text.setAttribute("data-key", `filter-${compKeys[i]}`);
			li.appendChild(text);
			compList.appendChild(li);
			comps.push(li);
		}
		const compContent = addToSection(compHeader, compList);
		filters.appendChild(compContent);

		// End: Completion Filters

		aside.appendChild(filters);

		// Change locale
		const localeSect = document.createElement("form");
		localeSect.classList.add("locale-select");
		const locales = ["en", "tr"];
		const inputs = [];
		for (let locale of locales) {
			let storageLang = getLocale();

			// Input
			let input = document.createElement("input");
			input.id = `toggle-${locale}`;
			input.classList.add("toggle", `toggle-${locale}`);
			input.setAttribute("type", "radio");
			input.setAttribute("name", "toggle");
			input.setAttribute("value", "false");
			if (locale === storageLang) {
				input.checked = true;
			}
			inputs.push(input);
			localeSect.appendChild(input);

			// Label
			let labelElement = document.createElement("label");
			labelElement.setAttribute("for", `toggle-${locale}`);
			labelElement.classList.add("btn");
			labelElement.textContent = locale;
			localeSect.appendChild(labelElement);
		}

		aside.appendChild(addToSection(localeSect));

		return {
			self: aside,
			tagList: tagList,
			tags: tags,
			dateList: dateList,
			dates: dates,
			compList: compList,
			comps: comps,
			langInputs: inputs,
			populateFilterTags: populateFilterTags
		};
	},
	main: (function () {
		let main = document.createElement("main");

		return { self: main };
	})(),
	newTodoBtn: (function () {
		let sect = document.createElement("i");
		sect.classList.add("btn-create", "fas", "fa-plus");

		return sect;
	})(),
	newTodoForm: (function () {
		let container = document.createElement("div");

		// Debug version
		// container.classList.add("new-todo", "active");
		container.classList.add("new-todo");

		let btnClose = document.createElement("i");
		btnClose.classList.add("btn-close", "fas", "fa-times", "fade-out");
		container.appendChild(btnClose);

		let form = document.createElement("form");
		form.classList.add("new-todo__form");

		const formElements = ["title", "dueDate", "description", "notes", "checklist", "tags", "priority"];

		// These variables are pre-declared so they can be assigned values that are normally temporary variables in the for loop
		// -Flatpickr instance
		let fp;
		// -Show available tags button
		let btnShowTags;

		for (let element of formElements) {
			let id = `form-${element}`;

			let label = document.createElement("label");
			let lblText = document.createElement("span");
			lblText.textContent = element;
			lblText.setAttribute("data-key", element);
			label.appendChild(lblText);
			label.setAttribute("for", id);

			let input = document.createElement("input");

			if (element === "title") {
				input.pattern = "^[a-zA-Z1-9].*";
				input.required = true;
				input.title = "No whitespace at the beginning";
			} else if (element === "dueDate") {
				input.type = "text";
				input.required = true;

				// Flatpickr
				fp = flatpickr(input, {
					enableTime: true,
					time_24hr: true,
					dateFormat: "d.m.Y - H:i",
					minDate: "today",
					defaultDate: "today",
					disableMobile: "true",
					locale: getLocale() === "en" ? "en" : Turkish,
					onReady: function (selectedDates, dateStr, instance) {
						// Create an initial date to reset to when form is submitted.
						this.initialDate = dateStr;
					}
				});
			} else if (element === "priority") {
				const prioColors = { "-": "var(--dark-gray)", "!": "#3f73d5", "!!": "#e18701", "!!!": "#de4d4a" };

				// Label changed to span
				label = document.createElement("span");
				label.textContent = element;
				label.setAttribute("data-key", element);

				// Input changed to container
				input = document.createElement("div");
				input.classList.add("disable-select");
				let prios = ["-", "!", "!!", "!!!"];
				for (let i = 0; i < prios.length; i++) {
					let radioID = `prio-${i}`;

					let radio = document.createElement("input");
					radio.type = "radio";
					radio.id = radioID;
					radio.name = "priority";
					radio.setAttribute("autocomplete", "off");
					if (i === 0) {
						radio.checked = true;
					}

					let radioLabel = document.createElement("label");
					radioLabel.textContent = prios[i];
					radioLabel.setAttribute("for", radioID);
					radioLabel.style.cssText = `--priority-color: ${prioColors[prios[i]]};`;

					input.appendChild(radio);
					input.appendChild(radioLabel);
				}
			} else if (["description", "notes", "checklist", "tags"].includes(element)) {
				// Font awesome plus icon
				let faPlus = document.createElement("i");
				faPlus.classList.add("fas", "fa-plus", "add-optional-input");
				label.appendChild(faPlus);

				if (element === "tags") {
					btnShowTags = faPlus;
					input = document.createElement("div");
					input.classList.add("disable-select");
				}
			}

			let pseuodTable = document.createElement("div");
			pseuodTable.classList.add("pseudo-table");

			input.id = id;
			label.classList.add("label", "disable-select");
			pseuodTable.appendChild(input);
			pseuodTable.appendChild(label);
			form.appendChild(pseuodTable);
		}

		// Start: Add Todo Button
		let btnAddContaier = document.createElement("div");
		btnAddContaier.classList.add("pseudo-table");

		let btnAdd = document.createElement("button");
		btnAdd.classList.add("btn-add-todo");

		let btnAddIcon = document.createElement("i");
		btnAddIcon.classList.add("fas", "fa-plus", "btn-add-todo__icon");
		btnAdd.appendChild(btnAddIcon);

		let btnAddText = document.createElement("span");
		btnAddText.setAttribute("data-key", "btn-add");
		btnAdd.appendChild(btnAddText);

		btnAddContaier.appendChild(btnAdd);
		form.appendChild(btnAddContaier);
		// End: Add Todo Button

		container.appendChild(form);

		// Returns true if form submission is valid (all required fields are filled)
		function isValid() {
			let reqInputs = form.querySelectorAll(":required");
			let valid = true;
			for (let input of reqInputs) {
				if (!input.checkValidity()) valid = false;
			}
			return valid;
		}

		// New Tag Creation
		const newTag = (function () {
			// New Tag
			let id = "new-tag";
			let container = document.createElement("div");
			container.id = "new-tag-container";

			let input = document.createElement("input");
			input.id = id;

			let label = document.createElement("label");
			label.setAttribute("for", id);

			let text = document.createElement("span");
			text.setAttribute("data-key", "btn-add");
			label.appendChild(text);

			let icon = document.createElement("i");
			icon.classList.add("fas", "fa-chevron-down");
			icon.classList.add("btn-new-tag");
			label.appendChild(icon);

			container.appendChild(input);
			container.appendChild(label);

			// Created Tag
			function addCreatedTag() {
				let id = `tag-${newTag.input.value}`;
				let input = document.createElement("input");
				input.id = id;
				input.type = "checkbox";
				input.setAttribute("autocomplete", "off");
				input.checked = true;

				let label = document.createElement("label");
				label.classList.add("tag");
				label.setAttribute("for", id);

				let icon = document.createElement("i");
				icon.classList.add("fas", "fa-hashtag");
				label.appendChild(icon);

				let text = document.createElement("span");
				text.textContent = newTag.input.value;
				label.appendChild(text);

				let tagsContainer = form.querySelector("#form-tags");
				tagsContainer.insertBefore(input, newTag.container);
				tagsContainer.insertBefore(label, newTag.container);

				// return { input: input, label: label };
			}

			function limitInput(element) {
				var max_chars = 10;

				if (element.value.length > max_chars) {
					element.value = element.value.substr(0, max_chars);
				}
			}

			function passesTest() {
				let value = newTag.input.value;
				let enoughChars = value.length >= 2;
				let noSpaceOnStart = /^\S/i.test(value);
				let notAll = !/^all$/i.test(value) && !/^hepsi$/i.test(value);
				return enoughChars && noSpaceOnStart && notAll;
			}

			return {
				container: container,
				input: input,
				btn: icon,
				limitInput: limitInput,
				addCreatedTag: addCreatedTag,
				passesTest: passesTest
			};
		})();

		// Once tags are received from storage, populate #form-tags with the available tags.
		function populateFormTags(obj) {
			let tags = Object.keys(obj);
			let container = form.querySelector("#form-tags");
			container.innerHTML = "";
			tags.forEach((tag) => {
				if (tag != "all") {
					let id = `tag-${tag}`;
					let input = document.createElement("input");
					input.type = "checkbox";
					input.id = id;
					input.setAttribute("autocomplete", "off");

					let label = document.createElement("label");
					label.classList.add("tag", "form-tag");
					label.setAttribute("for", id);
					let lblIcon = document.createElement("i");
					lblIcon.classList.add("fas", "fa-hashtag");
					label.appendChild(lblIcon);

					let lblText = document.createElement("span");
					lblText.textContent = tag;
					label.appendChild(lblText);

					container.appendChild(input);
					container.appendChild(label);
				}
			});

			container.appendChild(newTag.container);
			// container.appendChild(newTag.label);
		}

		// Returns an Object that contains form inputs
		function getFormInputs() {
			let info = { tags: [] };
			// `as` is an object that contain aliases for input ID's so that they are easier to access.
			let as = {
				"form-title": "title",
				"form-dueDate": "dueDate",
				"form-description": "description",
				"form-notes": "notes",
				"form-checklist": "checklist",
				prio: "priority"
			};

			let inputs = form.querySelectorAll("input");
			inputs.forEach((input) => {
				if (input.id === "form-dueDate") {
					info[as[input.id]] = fp.parseDate(input.value, "d.m.Y - H:i");
				} else if (input.type === "checkbox") {
					if (input.checked) {
						// Remove "tag-" prefix before adding tag to array
						info["tags"].push(input.id.replace(/^tag-+/i, ""));
					}
				} else if (input.type === "radio") {
					if (input.checked) {
						// as[input.id.split("-")[0]] = "prio" (radios IDs are prio-0, prio-1...)
						// querySelector gets the label content of attached to this input
						info[as[input.id.split("-")[0]]] = form.querySelector(`label[for="${input.id}"]`).textContent;
					}
				} else {
					info[as[input.id]] = input.value;
				}
			});

			return info;
		}

		// Using default form.reset() is not ideal as it clears default date and default priority
		function resetForm() {
			// Due Date
			fp.setDate(fp.initialDate);

			form.querySelectorAll("input").forEach((input) => {
				if (input.id != "form-dueDate") {
					if (input.type === "checkbox") {
						input.checked = false;
					} else if (input.type === "radio") {
						if (input.id === "prio-0") {
							input.checked = true;
						}
					} else {
						input.value = "";
					}
				}
			});

			form.querySelector("#form-tags").classList.remove("visible");
		}

		return {
			self: container,
			btnClose: btnClose,
			btnAdd: btnAdd,
			form: form,
			isValid: isValid,
			populateFormTags: populateFormTags,
			btnShowTags: btnShowTags,
			newTag: newTag,
			getFormInputs: getFormInputs,
			resetForm: resetForm,
			fp: fp
		};
	})(),
	newTodoElementsToggle: function () {
		this.newTodoForm.self.classList.toggle("active");
		this.newTodoForm.btnClose.classList.toggle("fade-out");
		this.newTodoBtn.classList.toggle("fade-out");
	},
	updateIndexes: function (index) {
		index = Number(index);
		let deleted = DOM.main.self.querySelector(`[data-index='${index}']`);
		deleted.remove();
		DOM.todos.list.splice(index, 1);
		DOM.todos.list.forEach((todo) => {
			let dataIndex = todo.getAttribute("data-index");
			if (dataIndex > index) {
				todo.setAttribute("data-index", dataIndex - 1);
			}
		});
	},
	todos: { list: [], detailsList: [], checkboxList: [], deleteBtnsList: [] },
	/**
	 * @param {Array} todos An array of todos to display
	 * @param {Array} filteredIndexes An array of filtered indexes of todos. If provided, only these will be shown [Optional]
	 */
	displayTodos: function (todos, filteredIndexes) {
		// Since this function will be called each time there is a filter applied,
		// it should always start on a clean plate.
		this.main.self.innerHTML = "";

		filteredIndexes = filteredIndexes ? filteredIndexes : null;

		// If filtered indexes are provided:
		if (filteredIndexes) {
			let filteredTodos = [];
			for (let todo of todos) {
				if (filteredIndexes.includes(todo.index)) {
					filteredTodos.push(todo);
				}
			}

			// Replace initial todos with filtered ones before going for the display loop
			todos = filteredTodos;
		}

		function appendTo(parent, elementArray) {
			elementArray.forEach((element) => {
				parent.appendChild(element);
			});
		}

		// For each array element, create a todo container
		if (todos.length) {
			for (let todo of todos) {
				let container = document.createElement("div");
				container.classList.add("todo");
				container.setAttribute("data-index", todo.index);

				let todoState = document.createElement("div");
				todoState.classList.add("todo-state");

				// Todo Checkbox to mark as completed
				let todoCheckbox = (function () {
					let checkbox = document.createElement("label");
					checkbox.classList.add("checkbox", "path");

					let input = document.createElement("input");
					input.type = "checkbox";
					input.checked = todo.isComplete;
					checkbox.appendChild(input);

					let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
					svg.setAttribute("viewBox", "0 0 21 21");

					let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
					path.setAttribute(
						"d",
						"M5,10.75 L8.5,14.25 L19.4,2.3 C18.8333333,1.43333333 18.0333333,1 17,1 L4,1 C2.35,1 1,2.35 1,4 L1,17 C1,18.65 2.35,20 4,20 L17,20 C18.65,20 20,18.65 20,17 L20,7.99769186"
					);
					svg.appendChild(path);

					checkbox.appendChild(svg);

					DOM.todos.checkboxList.push(checkbox);
					return checkbox;
				})();

				let todoDelete = document.createElement("i");
				todoDelete.classList.add("btn-delete-todo", "fas", "fa-trash-alt");
				DOM.todos.deleteBtnsList.push(todoDelete);

				appendTo(todoState, [todoCheckbox, todoDelete]);
				appendTo(container, [todoState]);

				// Main Content
				let todoContent = document.createElement("div");
				todoContent.classList.add("todo-main");

				// -Todo Title
				let title = document.createElement("span");
				title.classList.add("todo-title");
				title.textContent = todo.title;

				// Start: Todo Info (Description, Notes, Checklist, Tags)
				let infoContainer = document.createElement("div");
				infoContainer.classList.add("todo-info");

				if (todo.description) {
					let desc = document.createElement("p");
					desc.classList.add("todo-description");
					desc.textContent = todo.description;
					infoContainer.appendChild(desc);
				}

				if (todo.notes) {
					let note = document.createElement("p");
					note.classList.add("todo-note");
					note.textContent = todo.notes;
					infoContainer.appendChild(note);
				}

				// Start: Todo subtext
				let subtext = document.createElement("div");
				subtext.classList.add("todo-subtext", "disable-select");

				// -Priority
				const prioColors = { "-": "var(--dark-gray)", "!": "#3f73d5", "!!": "#e18701", "!!!": "#de4d4a" };
				let priority = document.createElement("span");
				priority.classList.add("todo-priority");
				priority.textContent = todo.priority;
				priority.style.cssText = `--priority-color: ${prioColors[todo.priority]};`;

				// -Due Date
				let due = document.createElement("span");
				due.classList.add("todo-due-date");
				// Due Date is stored as stringified Date object,
				// The stored string is converted to a Date object,
				// then it will be formatted by date-fns library using local language before being added to display
				due.textContent = format(new Date(todo.dueDate), "d MMMM, HH:mm", {
					locale: getLocale() === "en" ? enUS : tr
				});

				// The actual time will be stored as data attributed in case user changes language, so it can be formatted again
				due.setAttribute("data-dueDate", todo.dueDate);
				// End: Todo Info

				// Start: Details button
				let btnDetails = document.createElement("div"); // Empty div
				// If Todo contains any details, create button. Else, leave it as empty div.
				btnDetails.classList.add("btn-details");

				let detailsTxt = document.createElement("span");
				detailsTxt.setAttribute("data-key", "details");
				detailsTxt.textContent = getLocale() === "en" ? "Details" : "Detaylar";
				btnDetails.appendChild(detailsTxt);

				let detailsIcon = document.createElement("i");
				detailsIcon.classList.add("fas", "fa-chevron-down");
				btnDetails.appendChild(detailsIcon);
				DOM.todos.detailsList.push(btnDetails);

				// End: Details button

				// Start: Tags
				if (todo.tags.length) {
					let todoTags = document.createElement("ul");
					todoTags.classList.add("tags", "disable-select");
					todo.tags.forEach((tag) => {
						let li = document.createElement("li");
						li.classList.add("tag");

						let icon = document.createElement("i");
						icon.classList.add("fas", "fa-hashtag");
						li.appendChild(icon);

						let text = document.createElement("span");
						text.textContent = tag;
						li.appendChild(text);

						todoTags.appendChild(li);
					});
					infoContainer.appendChild(todoTags);
				}
				// End: Tags

				appendTo(subtext, [priority, btnDetails, due]);

				appendTo(todoContent, [title, infoContainer, subtext]);
				appendTo(container, [todoContent]);
				this.todos.list.push(container);
				this.main.self.appendChild(container);
			}
		} else if (filteredIndexes) {
			// If todos list is empty because of indexes:
			let p = document.createElement("p");
			p.textContent = "No entry could be found matching the filter(s)";
			this.main.self.appendChild(p);
		} else {
			// If todos list is empty, because the user did not create any yet:
			let p = document.createElement("p");
			p.textContent = "You have not created any todos yet...";
			this.main.self.appendChild(p);
		}
	}
};
