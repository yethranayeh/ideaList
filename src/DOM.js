/** @format */

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
		this.mainArea.appendChild(this.main.self);
		this.displayTodos(todoList);
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
	displayTodos: function (...tags) {
		tags.forEach((tag) => {
			for (let key in tag) {
				// For each tag, create a header.
				let section = document.createElement("section");
				let sectionHeader = document.createElement("h2");
				sectionHeader.classList.add("disable-select");
				if (key === "all") {
					sectionHeader.setAttribute("data-key", "tag-all");
				}
				sectionHeader.textContent = key;
				section.appendChild(sectionHeader);

				// For each element in a tag, create a container
				for (let todo of tag[key]) {
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

					let todoCategory = document.createElement("p");
					todoCategory.textContent = todo.todoCategory;

					appendTo(subtext, [priority, due, todoCategory]);

					// When todo.category is changed to todo.tags, use this:
					// let todoTags = document.createElement("ul");
					// todo.tags.forEach((tag) => {
					// 	let li = document.createElement("li");
					// 	li.textContent = tag;
					// 	todoTags.appendChild(li);
					// });

					appendTo(todoContent, [title, infoContainer, subtext]);
					appendTo(container, [todoContent]);
					appendTo(section, [container]);
				}

				this.main.self.appendChild(section);
			}
			// console.info(`Key: %c${key}`, "background: white; color: #777");
			// todoList[key].forEach((obj) => {
			// 	console.log(obj.title);
			// 	console.log(obj.description);
			// 	console.log(obj.dueDate);
			// });
		});
	}
};
