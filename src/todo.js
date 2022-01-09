/** @format */

export default class Todo {
	constructor(title, description, dueDate, priority, notes, checklist) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.notes = notes;
		this.checklist = checklist;
		this.isComplete = false;
		this.categories = [];
	}

	addCategory(category) {
		this.categories.push(category.toString());
	}

	markAsComplete() {
		this.isComplete = true;
	}

	changePriority(priority) {
		this.priority = priority;
	}
}
