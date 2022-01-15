/** @format */

export default class Todo {
	constructor(title, description, dueDate, priority, notes, checklist) {
		this.title = title;
		this.description = description;
		this.dueDate = dueDate;
		this.priority = priority;
		this.notes = notes ? notes : null;
		this.checklist = checklist ? checklist : null;
		this.isComplete = false;
		this.tags = [];
	}

	addCategory(tag) {
		this.tags.push(tag.toString());
	}

	markAsComplete() {
		this.isComplete = true;
	}

	changePriority(priority) {
		this.priority = priority;
	}
}
