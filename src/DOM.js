/** @format */

export { DOM as default };

const DOM = {
	init: function (date, todoList) {
		this.body = document.querySelector("body");
		this.contentArea = this.body.querySelector("#content");

		// Navbar
		this.navbar.date.textContent = date;
		this.contentArea.appendChild(this.navbar.self);

		// Main content
		this.mainArea = document.createElement("div");
		this.mainArea.classList.add("container");
		this.contentArea.appendChild(this.mainArea);

		// Sidebar
		this.sidebar = this.sidebar(todoList);
		this.mainArea.appendChild(this.sidebar.self);
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
			today.classList.add("display-date");
			today.textContent = "test";

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
		aside.classList.add("active");

		// Wrap each part in a section tag before adding to sidebar
		function appendToAside(...elements) {
			let section = document.createElement("section");
			section.classList.add("disable-select");

			for (let element of elements) {
				section.appendChild(element);
			}
			aside.appendChild(section);
		}

		// Filter by Category
		const categoriesHeader = document.createElement("h2");
		categoriesHeader.textContent = "Filter by category:";
		aside.appendChild(categoriesHeader);

		const categoryList = document.createElement("ul");
		const categories = [];
		for (let key in todoList) {
			let li = document.createElement("li");
			li.classList.add("category");
			li.textContent = key === "default" ? "All" : key;
			if (key === "default") {
				li.id = "filterAll";
			}
			categoryList.appendChild(li);
			categories.push(li);
		}
		appendToAside(categoriesHeader, categoryList);

		// Filter by Date
		const dateHeader = document.createElement("h2");
		dateHeader.textContent = "Filter by date:";
		aside.appendChild(dateHeader);

		const dateOpts = ["Today", "This Week", "This Month"];
		const dateIconClasses = ["day", "week", "month"];
		const dateList = document.createElement("ul");
		const dates = [];
		for (let i = 0; i < 3; i++) {
			let li = document.createElement("li");
			li.classList.add("date", dateIconClasses[i]);
			li.textContent = dateOpts[i];
			dateList.appendChild(li);
			dates.push(li);
		}
		appendToAside(dateHeader, dateList);

		// Dummy text to test overflow
		// for (let i = 10; i > 0; i--) {
		// 	let h = document.createElement("h1");
		// 	h.textContent = "TEST";
		// 	h.style.cssText = "font-size: 2.5em; text-align: center";
		// 	appendToAside(h);
		// }

		return { self: aside, categoryList: categoryList, categories: categories, dateList: dateList, dates: dates };
	}
};
