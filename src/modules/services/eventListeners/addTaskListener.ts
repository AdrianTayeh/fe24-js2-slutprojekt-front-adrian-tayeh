import { addTask, fetchTasks } from "../apiService";
import { renderTasks } from "../renderService/renderIndex";
import { Task } from "../../models/tasks";
import { Member } from "../../models/members";

export async function handleAddTask(members: Member[]) {
    const title = (document.getElementById("task-input") as HTMLInputElement).value;
    const description = (document.getElementById("task-description") as HTMLInputElement).value;
    const category = (document.getElementById("task-category") as HTMLSelectElement).value as "ux" | "frontend" | "backend" | "none";
    const priority = (document.getElementById("task-priority") as HTMLSelectElement).value as "low" | "medium" | "high";
    const parentId = (document.getElementById("parent-task") as HTMLSelectElement).value || undefined;

    if (title && description && category !== "none") {
        const newTask = {
            title,
            description,
            category,
            priority,
            parentId,
        } as Partial<Task>;
        await addTask(newTask);
        const updatedTasks = await fetchTasks();
        renderTasks(updatedTasks, members);
        highlightElement(document.querySelector(".add-task"));
    }
}

function highlightElement(element: Element | null) {
    if (element) {
        element.classList.add("highlight");
        setTimeout(() => {
            element.classList.remove("highlight");
        }, 2000);
    }
}