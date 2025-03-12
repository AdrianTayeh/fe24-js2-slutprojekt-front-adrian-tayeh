import { Task } from "../../models/tasks";

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