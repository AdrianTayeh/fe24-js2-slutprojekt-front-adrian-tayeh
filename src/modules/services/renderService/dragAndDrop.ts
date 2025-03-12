import { Task } from "../../models/tasks";
import { Member } from "../../models/members";
import { fetchTasks, markTaskAsDone, assignTask } from "../apiService";
import { renderTasks } from "./renderTasks";
import { showAlert } from "../alertService";

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