import { Task } from "../models/tasks";
import { Member } from "../models/members";
import { fetchTasks, assignTask, markTaskAsDone, removeTask } from "./apiService";
import { applyFilters, applySort } from "./filterSortService";

export function renderTasks(tasks: Task[], members: Member[], filters: any = {}, sort: any = {}): void {
    let filteredTasks = applyFilters(tasks, filters);
    filteredTasks = applySort(filteredTasks, sort);

    const todoTasks = filteredTasks.filter(task => task.status === 'to do');
    const inProgressTasks = filteredTasks.filter(task => task.status === 'in progress');
    const doneTasks = filteredTasks.filter(task => task.status === 'done');

    renderTaskList(todoTasks, 'todo-tasks', members);
    renderTaskList(inProgressTasks, 'in-progress-tasks', members);
    renderTaskList(doneTasks, 'done-tasks', members);
}

function renderTaskList(tasks: Task[], elementId: string, members: Member[]): void {
    const taskListElement = document.getElementById(elementId);
    if (taskListElement) {
        taskListElement.innerHTML = '';
        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task';
            taskElement.innerHTML = `
                <div class="task-content">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Category: ${task.category}</p>
                    <p>Task created: ${task.timestamp}</p>
                    ${task.status === 'to do' ? renderAssignButton(task.category, members) : ''}
                    ${task.status === 'in progress' ? renderMarkAsDoneButton(task.id) : ''}
                    ${task.status === 'done' ? renderDeleteButton(task.id) : ''}
                </div>
                ${(task.status === 'in progress' || task.status === 'done') && task.assigned ? `<div class="profile-image">${getMemberInitials(task.assigned, members)}</div>` : ''}
            `;
            taskListElement.appendChild(taskElement);

            if (task.status === 'to do') {
                const assignSelect = taskElement.querySelector('select');
                if (assignSelect) {
                    assignSelect.addEventListener('change', async (event) => {
                        const memberId = (event.target as HTMLSelectElement).value;
                        await assignTask(task.id, memberId);
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
        <select>
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