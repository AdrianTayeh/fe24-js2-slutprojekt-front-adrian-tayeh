import { Task } from "../../models/tasks";
import { Member } from "../../models/members";
import { fetchTasks, markTaskAsDone, assignTask } from "../apiService";
import { renderTasks } from "./renderTasks";
import { showAlert } from "../alertService";

/**
 * Adds drag and drop event listeners to tasks and task lists
 * @param {Task[]} tasks - The array of tasks
 * @param {Member[]} members - The array of members
 */
export function addDragAndDropListeners(tasks: Task[], members: Member[]) {
    document.querySelectorAll('.task').forEach(task => {
        task.addEventListener('dragstart', (event) => handleDragStart(event as DragEvent));
        task.addEventListener('dragend', (event) => handleDragEnd(event as DragEvent));
    });

    document.querySelectorAll('.task-list').forEach(taskList => {
        taskList.addEventListener('dragover', (event) => handleDragOver(event as DragEvent));
        taskList.addEventListener('drop', (event) => handleDrop(event as DragEvent, tasks, members));
    });
}

/**
 * Handles the drag start event
 * @param {DragEvent} event - The drag event
 */
function handleDragStart(event: DragEvent) {
    const target = event.target as HTMLElement;
    event.dataTransfer?.setData('text/plain', target.dataset.id!);
    target.classList.add('dragging');
}

/**
 * Handles the drag end event
 * @param {DragEvent} event - The drag event
 */
function handleDragEnd(event: DragEvent) {
    const target = event.target as HTMLElement;
    target.classList.remove('dragging');
}

/**
 * Handles the drag over event
 * @param {DragEvent} event - The drag event
 */
function handleDragOver(event: DragEvent) {
    event.preventDefault();
}

/**
 * Handles the drop event
 * @param {DragEvent} event - The drag event
 * @param {Task[]} tasks - The array of tasks 
 * @param {Member[]} members - The array of members 
 */
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