import { Task } from "../../models/tasks";
import { Member } from "../../models/members";
import { renderAssignButton, renderMarkAsDoneButton, renderDeleteButton } from "./renderButtons";
import { assignTask, fetchTasks, markTaskAsDone, removeTask, updateTask } from "../apiService";
import { renderTasks } from "./renderTasks";
import { getMemberInitials } from "./utils";
import { renderSubtasks } from "./renderSubtasks";

/**
 * Renders a list of tasks in a specified element
 * @param {Task[]} tasks - The array of tasks
 * @param {string} elementId - The ID of the element to render the tasks in
 * @param {Member[]} members - The array of members
 */
export function renderTaskList(tasks: Task[], elementId: string, members: Member[]): void {
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