import { Member } from "../models/members";
import { Task } from "../models/tasks";
import { showAlert } from "./alertService";

const taskURL = "https://fe24-js2-slutprojekt-back-adrian-tayeh.onrender.com/tasks";
const memberURL = "https://fe24-js2-slutprojekt-back-adrian-tayeh.onrender.com/members";

export async function fetchTasks(): Promise<Task[]> {
    try {
        const response = await fetch(taskURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch tasks:", error);
        showAlert(error.message);
        return [];
    }
}

export async function fetchMembers(): Promise<Member[]> {
    try {
        const response = await fetch(memberURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch members:", error);
        showAlert(error.message);
        return [];
    }
}

export async function assignTask(taskId: string, memberId: string): Promise<void> {
    try {
        await fetch(`${taskURL}/${taskId}/assign`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ memberId }),
        });
    } catch (error) {
        console.error("Failed to assign task:", error);
        showAlert(error.message);
    }
}

export async function markTaskAsDone(taskId: string): Promise<void> {
    try {
        await fetch(`${taskURL}/${taskId}/done`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error("Failed to mark task as done:", error);
        showAlert(error.message);
    }
}

export async function removeTask(taskId: string): Promise<void> {
    try {
        await fetch(`${taskURL}/${taskId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Failed to remove task:", error);
        showAlert(error.message);
    }
}

export async function addTask(task: Partial<Task>): Promise<void> {
    try {
        const response = await fetch(taskURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to add task:", error);
        showAlert(error.message);
    }
}

export async function addMember(member: Partial<Member>): Promise<void> {
    try {
        await fetch(memberURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(member),
        });
    } catch (error) {
        console.error("Failed to add member:", error);
        showAlert(error.message);
    }
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<void> {
    try {
        const response = await fetch(`${taskURL}/${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
        });
        if(!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error("Failed to update task:", error);
        showAlert(error.message);
    }
}