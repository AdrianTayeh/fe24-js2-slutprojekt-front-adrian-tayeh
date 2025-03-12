import { Task } from "../../models/tasks";
import { Member } from "../../models/members";
import { renderTaskList } from "./renderTaskList";
import { addDragAndDropListeners } from "./dragAndDrop";
import { applyFilters, applySort } from "../filterSortService";

export function renderTasks(tasks: Task[], members: Member[], filters: any = {}, sort: any = {}): void {
    let filteredTasks = applyFilters(tasks, filters);
    filteredTasks = applySort(filteredTasks, sort);

    const todoTasks = filteredTasks.filter(task => task.status === 'to do' && !task.parentId);
    const inProgressTasks = filteredTasks.filter(task => task.status === 'in progress' && !task.parentId);
    const doneTasks = filteredTasks.filter(task => task.status === 'done' && !task.parentId);

    renderTaskList(todoTasks, 'todo-tasks', members);
    renderTaskList(inProgressTasks, 'in-progress-tasks', members);
    renderTaskList(doneTasks, 'done-tasks', members);

    addDragAndDropListeners(tasks, members);
    populateParentTaskSelect(tasks);
}

function populateParentTaskSelect(tasks: Task[]): void {
    const parentTaskSelect = document.getElementById('parent-task') as HTMLSelectElement;
    if (parentTaskSelect) {
        parentTaskSelect.innerHTML = '<option value="">No Parent Task</option>';
        tasks.forEach(task => {
            const option = document.createElement('option');
            option.value = task.id;
            option.textContent = task.title;
            parentTaskSelect.appendChild(option);
        });
    }
}