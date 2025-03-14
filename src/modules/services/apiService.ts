import { Member } from "../models/members";
import { Task } from "../models/tasks";
import { showAlert } from "./alertService";

// URLs for the API endpoints
const taskURL =
  "https://fe24-js2-slutprojekt-back-adrian-tayeh.onrender.com/tasks";
const memberURL =
  "https://fe24-js2-slutprojekt-back-adrian-tayeh.onrender.com/members";

  /**
   * Fetches tasks from the API
   * @returns {Promise<Task[]>} A promise that resolves to an array of tasks
   */
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

/**
 * Fetches members from the API
 * @returns {Promise<Member[]>} A promise that resolves to an array of members
 */
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

/**
 * Assigns a task to a member
 * @param {string} taskId - The ID of the task to assign
 * @param {string} memberId - The ID of the member to assign the task to
 */
export async function assignTask(
  taskId: string,
  memberId: string
): Promise<void> {
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

/**
 * Marks a task as done
 * @param {string} taskId - The ID of the task to mark as done
 */
export async function markTaskAsDone(taskId: string): Promise<void> {
  try {
    await fetch(`${taskURL}/${taskId}/done`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to mark task as done:", error);
    showAlert(error.message);
  }
}

/**
 * Reomves a task
 * @param {string} taskId - The ID of the task to remove
 */
export async function removeTask(taskId: string): Promise<void> {
  try {
    await fetch(`${taskURL}/${taskId}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Failed to remove task:", error);
    showAlert(error.message);
  }
}

/**
 * Adds a new task
 * @param {Partial<Task>} task - The task data to add
 */
export async function addTask(task: Partial<Task>): Promise<void> {
  try {
    const response = await fetch(taskURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
    const createdTask = await response.json();
    if (task.parentId) {
      await updateParentTaskWithSubtask(task.parentId, createdTask.id);
    }
  } catch (error) {
    console.error("Failed to add task:", error);
    showAlert(error.message);
  }
}

/**
 * Updates a parent task with a subtask
 * @param {string} parentId - The ID of the parent task
 * @param {string} subtaskId - The ID of the subtask to add
 */
async function updateParentTaskWithSubtask(
  parentId: string,
  subtaskId: string
): Promise<void> {
  try {
    const response = await fetch(`${taskURL}/${parentId}/subtasks`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subtaskId }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Failed to update parent task with subtask:", error);
    showAlert(error.message);
  }
}

/**
 * Adds a new member
 * @param {Partial<Member>} member - The member data to add
 */
export async function addMember(member: Partial<Member>): Promise<void> {
  try {
    console.log("Adding new member:", member);
    await fetch(memberURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(member),
    });
  } catch (error) {
    console.error("Failed to add member:", error);
    showAlert(error.message);
  }
}

/**
 * Updates a task
 * @param {string} taskId - The ID of the task to update
 * @param {Partial<Task>} updates - The task data to update
 */
export async function updateTask(
  taskId: string,
  updates: Partial<Task>
): Promise<void> {
  try {
    const response = await fetch(`${taskURL}/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }
  } catch (error) {
    console.error("Failed to update task:", error);
    showAlert(error.message);
  }
}
