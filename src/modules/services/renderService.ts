import { Task } from "../models/tasks";
import { Member } from "../models/members";
import { fetchTasks, assignTask, markTaskAsDone, removeTask, updateTask } from "./apiService";
import { applyFilters, applySort } from "./filterSortService";
import { showAlert } from "./alertService";

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

function renderTaskList(tasks: Task[], elementId: string, members: Member[]): void {
    const taskListElement = document.getElementById(elementId);
    if (taskListElement) {
        taskListElement.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task priority-${task.priority} ${task.parentId ? 'subtask' : 'parent-task'}`;
            taskElement.draggable = true;
            taskElement.dataset.id = task.id;
            taskElement.innerHTML = `
                <div class="task-content">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Category: ${task.category}</p>
                    <p>Task created: ${task.timestamp}</p>
                    ${task.status === 'to do' ? renderAssignButton(task.category, members) : ''}
                    ${task.status === 'in progress' ? renderMarkAsDoneButton(task.id) : ''}
                    ${task.status === 'done' ? renderDeleteButton(task.id) : ''}
                    ${task.subtasks && task.subtasks.length > 0 ? renderSubtasks(task.subtasks) : ''}
                </div>
                ${(task.status === 'in progress' || task.status === 'done') && task.assigned ? `<div class="profile-image">${getMemberInitials(task.assigned, members)}</div>` : ''}
            `;
            taskListElement.appendChild(taskElement);

            if (task.status === 'to do') {
                const assignSelect = taskElement.querySelector('select.assign-member');
                if (assignSelect) {
                    assignSelect.addEventListener('change', async (event) => {
                        const memberId = (event.target as HTMLSelectElement).value;
                        await assignTask(task.id, memberId);
                        const updatedTasks = await fetchTasks();
                        renderTasks(updatedTasks, members);
                    });
                }

                const prioritySelect = taskElement.querySelector('select.priority-select');
                if(prioritySelect) {
                    prioritySelect.addEventListener('change', async (event) => {
                        const priority = (event.target as HTMLSelectElement).value as 'low' | 'medium' | 'high';
                        await updateTask(task.id, {priority});
                        const updatedTasks = await fetchTasks();
                        renderTasks(updatedTasks, members);
                    });
                }
            }

            if (task.status === 'in progress') {
                const markAsDoneButton = taskElement.querySelector('button');
                if (markAsDoneButton) {
                    markAsDoneButton.addEventListener('click', async () => {
                        await markTaskAsDone(task.id);
                        const updatedTasks = await fetchTasks();
                        renderTasks(updatedTasks, members);
                    });
                }
            }

            if (task.status === 'done') {
                const deleteButton = taskElement.querySelector('button');
                if (deleteButton) {
                    deleteButton.addEventListener('click', async () => {
                        await removeTask(task.id);
                        const updatedTasks = await fetchTasks();
                        renderTasks(updatedTasks, members);
                    });
                }
            }
        });
    }
}

function renderAssignButton(category: 'ux' | 'frontend' | 'backend', members: Member[]): string {
    const eligibleMembers = members.filter(member => member.roles.includes(category));
    return `
        <select class="assign-member">
            <option value="">Assign to...</option>
            ${eligibleMembers.map(member => `<option value="${member.id}">${member.name}</option>`).join('')}
        </select>
    `;
}

function renderMarkAsDoneButton(taskId: string): string {
    return `<button>Mark as Done</button>`;
}

function renderDeleteButton(taskId: string): string {
    return `<button>Delete</button>`;
}

function getMemberInitials(memberId: string, members: Member[]): string {
    const member = members.find(member => member.id === memberId);
    if(member) {
        const initials = member.name.split(' ').map(name => name[0]).join('');
        return initials.toUpperCase();
    }
    return '??';
}

function addDragAndDropListeners(tasks: Task[], members: Member[]) {
    document.querySelectorAll('.task').forEach(task => {
        task.addEventListener('dragstart', (event) => handleDragStart(event as DragEvent));
        task.addEventListener('dragend', (event) => handleDragEnd(event as DragEvent));
    });

    document.querySelectorAll('.task-list').forEach(taskList => {
        taskList.addEventListener('dragover', (event) => handleDragOver(event as DragEvent));
        taskList.addEventListener('drop', (event) => handleDrop(event as DragEvent, tasks, members));
    });
}

function handleDragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    event.dataTransfer?.setData('text/plain', target.dataset.id!);
    target.classList.add('dragging');
}

function handleDragEnd(event: DragEvent) {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
}

function handleDragOver(event: DragEvent) {
    event.preventDefault();
}

async function handleDrop(event: DragEvent, tasks: Task[], members: Member[]) {
    event.preventDefault();
    const taskId = event.dataTransfer?.getData('text/plain')!;
    const taskElement = document.querySelector(`[data-id="${taskId}"]`) as HTMLElement;
    const task = tasks.find(t => t.id === taskId)!;
    const targetListId = (event.target as HTMLElement).closest('.task-list')!.id;

    if (targetListId === 'done-tasks' && task.status === 'in progress') {
        task.status = 'done';
        await markTaskAsDone(task.id);
        const updatedTasks = await fetchTasks();
        renderTasks(updatedTasks, members);
    } else if (targetListId === 'in-progress-tasks' && task.status === 'to do' && task.assigned) {
        task.status = 'in progress';
        await assignTask(task.id, task.assigned);
        const updatedTasks = await fetchTasks();
        renderTasks(updatedTasks, members);
    } else {
        showAlert('Cannot move task to this column.');
    }
}

function renderSubtasks(subtasks: Task[]): string {
    return `
        <div class="subtasks">
            <h4>Subtasks:</h4>
            <ul>
                ${subtasks.map(subtask => `
                    <li class="subtask-item">
                        <div class="subtask-card priority-${subtask.priority}" data-id="${subtask.id}">
                            <h5>${subtask.title}</h5>
                            <p>Category: ${subtask.category}</p>
                        </div>
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
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