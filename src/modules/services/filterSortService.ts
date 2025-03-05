import { Task } from "../models/tasks";

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

export function applySort(tasks: Task[], sort: any): Task[] {
    if(sort.field) {
        tasks = tasks.sort((a,b) => {
            if(sort.field === 'timestamp') {
                return sort.order === 'asc' ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime() : new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            } else if(sort.field === 'title') {
                return sort.order === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
            }
            return 0;
        })
    }
    return tasks;
}