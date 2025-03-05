import { Member } from "../models/members";
import { Task } from "../models/tasks";

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
    }
}

export async function removeTask(taskId: string): Promise<void> {
    try {
        await fetch(`${taskURL}/${taskId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error("Failed to remove task:", error);
    }
}

export async function addTask(task: Partial<Task>): Promise<void> {
    try {
        await fetch(taskURL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task),
        });
    } catch (error) {
        console.error("Failed to add task:", error);
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
    }
}