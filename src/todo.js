/** @format */

export default class Todo {
	constructor(obj) {
		this.title = obj.title;
		this.dueDate = obj.dueDate;
		this.priority = obj.priority;
		this.description = obj.description;
		this.notes = obj.notes;
		this.checklist = obj.checklist;
		this.tags = obj.tags;
		this.isComplete = false;
	}

	addTag(tag) {
		this.tags.push(tag.toString());
	}

	markAsComplete() {
		this.isComplete = true;
	}

	changePriority(priority) {
		this.priority = priority;
	}
}
