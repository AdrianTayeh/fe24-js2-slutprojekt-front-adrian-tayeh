import { Task } from "../../models/tasks";

/**
 * Renders the subtasks of a task
 * @param {Task[]} subtasks - The array of subtasks
 * @returns {string} The HTML for the subtasks
 */
export function renderSubtasks(subtasks: Task[]): string {
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