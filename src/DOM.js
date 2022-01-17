/** @format */

import flatpickr from "flatpickr";
require("flatpickr/dist/themes/dark.css");

export { DOM as default };

const DOM = {
	init: function (date, todoList) {
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
		this.mainArea.appendChild(this.newTodoForm.self);
		let maxHeight = this.newTodoForm.self.offsetHeight + 16 * 6;
		this.newTodoForm.self.style.cssText = `--max-height: ${maxHeight}px; --min-height: 0px`;
		this.mainArea.appendChild(this.newTodoBtn);
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

		// Filter by Tag
		const tagsHeader = document.createElement("h2");
		tagsHeader.setAttribute("data-key", "tags-header");
		// tagsHeader.textContent = "Tags:";
		aside.appendChild(tagsHeader);

		const tagList = document.createElement("ul");
		const tags = [];
		for (let key in todoList) {
			let li = document.createElement("li");
			li.classList.add("tag");
			li.textContent = key;
			if (key === "all") {
				li.id = "filterAll";
				li.classList.add("active");
				li.setAttribute("data-key", "tag-all");
			}
			tagList.appendChild(li);
			tags.push(li);
		}
		let tagContent = addToSection(tagsHeader, tagList);
		filters.appendChild(tagContent);

		// Filter by Date
		const dateHeader = document.createElement("h2");
		dateHeader.setAttribute("data-key", "date-header");
		aside.appendChild(dateHeader);

		// const dateOpts = ["Today", "This Week", "This Month"];
		const dateIconClasses = ["day", "week", "month"];
		const dateList = document.createElement("ul");
		const dates = [];
		for (let i = 0; i < 3; i++) {
			let li = document.createElement("li");
			li.setAttribute("data-key", `date-filter-${dateIconClasses[i]}`);
			li.classList.add("date", dateIconClasses[i]);
			// li.textContent = dateOpts[i];
			dateList.appendChild(li);
			dates.push(li);
		}
		const dateContent = addToSection(dateHeader, dateList);
		filters.appendChild(dateContent);
		aside.appendChild(filters);

		// Change locale
		const localeSect = document.createElement("form");
		localeSect.classList.add("locale-select");
		const locales = ["en", "tr"];
		const inputs = [];
		for (let locale of locales) {
			let storageLang = localStorage.getItem("TodoLanguage");
			storageLang = storageLang ? storageLang : "en";
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

		// Dummy text to test overflow-y
		// for (let i = 10; i > 0; i--) {
		// 	let h = document.createElement("h1");
		// 	h.textContent = "TEST";
		// 	h.style.cssText = "font-size: 2.5em; text-align: center";
		// 	aside.appendChild(h);
		// }

		return { self: aside, tagList: tagList, tags: tags, dateList: dateList, dates: dates, langInputs: inputs };
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
		container.classList.add("new-todo", "active");

		let btnClose = document.createElement("i");
		btnClose.classList.add("btn-close", "fas", "fa-times", "fade-out");
		container.appendChild(btnClose);

		let form = document.createElement("form");
		form.classList.add("new-todo__form");

		const formElements = ["title", "description", "dueDate", "priority", "notes", "checklist"];

		// Flatpickr instance
		let fp;

		for (let element of formElements) {
			let id = `form-${element}`;

			let label = document.createElement("label");
			label.textContent = element;
			label.setAttribute("for", id);

			let input = document.createElement("input");

			if (element === "title") {
				input.required = true;
			} else if (element === "dueDate") {
				label.textContent = "Due Date";
				input.type = "text";
				input.required = true;

				// Flatpickr
				fp = flatpickr(input, {
					enableTime: true,
					time_24hr: true,
					dateFormat: "d.m.Y - H:i",
					minDate: "today",
					defaultDate: "today",
					disableMobile: "true"
				});
			} else if (element === "priority") {
				// Label changed to span
				label = document.createElement("span");
				label.textContent = element;
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

					input.appendChild(radio);
					input.appendChild(radioLabel);
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

		let btnAddContaier = document.createElement("div");
		btnAddContaier.classList.add("pseudo-table");
		let btnAdd = document.createElement("button");
		// btnAdd.type = "submit";
		btnAdd.textContent = "Add";
		btnAdd.classList.add("btn-add-todo");
		btnAddContaier.appendChild(btnAdd);
		form.appendChild(btnAddContaier);

		container.appendChild(form);

		function isValid() {
			let reqInputs = form.querySelectorAll(":required");
			let valid = true;
			for (let input of reqInputs) {
				if (!input.checkValidity()) valid = false;
			}
			return valid;
		}

		return { self: container, btnClose: btnClose, btnAdd: btnAdd, form: form, isValid: isValid, fp: fp };
	})(),
	newTodoElementsToggle: function () {
		this.newTodoForm.self.classList.toggle("active");
		this.newTodoForm.btnClose.classList.toggle("fade-out");
		this.newTodoBtn.classList.toggle("fade-out");
	},
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

		// For each array element, create a todo container
		if (todos.length) {
			for (let todo of todos) {
				let container = document.createElement("div");
				container.classList.add("todo");

				function appendTo(parent, elementArray) {
					elementArray.forEach((element) => {
						parent.appendChild(element);
					});
				}

				// Todo Checkbox to mark as completed
				let todoCheckbox = document.createElement("div");
				todoCheckbox.classList.add("todo-checkbox");
				let isComplete = document.createElement("input");
				isComplete.setAttribute("type", "checkbox");
				isComplete.disabled = true;
				if (todo.isComplete) {
					isComplete.checked = true;
				}
				todoCheckbox.appendChild(isComplete);
				appendTo(container, [todoCheckbox]);

				// Main Content
				let todoContent = document.createElement("div");
				todoContent.classList.add("todo-main");

				// -Todo Title
				let title = document.createElement("span");
				title.classList.add("todo-title");
				title.textContent = todo.title;

				// Todo Info (Description and Notes)
				let infoContainer = document.createElement("div");
				infoContainer.classList.add("todo-info");

				let desc = document.createElement("p");
				desc.classList.add("todo-description");
				desc.textContent = todo.description;
				infoContainer.appendChild(desc);

				if (todo.notes.length) {
					let note = document.createElement("p");
					note.classList.add("todo-note");
					note.textContent = todo.notes;
					infoContainer.appendChild(note);
				}

				// Todo subtext
				let subtext = document.createElement("div");
				subtext.classList.add("todo-subtext");

				let priority = document.createElement("span");
				priority.classList.add("todo-priority");
				priority.textContent = todo.priority;

				let due = document.createElement("span");
				due.classList.add("todo-due-date");
				due.textContent = todo.dueDate;

				let todoTags = document.createElement("ul");
				todo.tags.forEach((tag) => {
					let li = document.createElement("li");
					li.textContent = tag;
					todoTags.appendChild(li);
				});

				appendTo(subtext, [priority, due, todoTags]);

				appendTo(todoContent, [title, infoContainer, subtext]);
				appendTo(container, [todoContent]);
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
