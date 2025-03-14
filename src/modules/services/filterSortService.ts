import { Task } from "../models/tasks";

/**
 * Applies filter to the list of tasks
 * @param {Task[]} tasks - The array of tasks
 * @param {any} filters - The filters to apply
 * @returns {Task[]} The filtered array of tasks
 */
export function applyFilters(tasks: Task[], filters: any): Task[] {
    let filteredTasks = tasks;

    if (filters.memberId) {
        filteredTasks = filteredTasks.filter(task => task.assigned === filters.memberId);
    }
    if (filters.category) {
        filteredTasks = filteredTasks.filter(task => task.category === filters.category);
    }

    return filteredTasks;
}

/**
 * Applies sorting to the list of tasks
 * @param {Task[]} tasks - The array of tasks 
 * @param {any} sort - The sorting options 
 * @returns {Task[]} The sorted array of tasks
 */
export function applySort(tasks: Task[], sort: any): Task[] {
    if(sort.field) {
        tasks = tasks.sort((a,b) => {
            if(sort.field === 'timestamp') {
                return sort.order === 'asc' ? a.timestamp.localeCompare(b.timestamp) : b.timestamp.localeCompare(a.timestamp);
            } else if(sort.field === 'title') {
                return sort.order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            }
            return 0;
        })
    }
    return tasks;
}