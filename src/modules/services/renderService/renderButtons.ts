import { Member } from "../../models/members";

/**
 * Renders an assign button with a dropdown of eligible members
 * @param {string} category - The category of the task
 * @param {Member[]} members - The array of members
 * @returns {string} The HTML for the assign button
 */
export function renderAssignButton(category: 'ux' | 'frontend' | 'backend', members: Member[]): string {
    const eligibleMembers = members.filter(member => member.roles.includes(category));
    return `
        <select class="assign-member">
            <option value="">Assign to...</option>
            ${eligibleMembers.map(member => `<option value="${member.id}">${member.name}</option>`).join('')}
        </select>
    `;
}

/**
 * Renders a mark as done button
 * @param {string} taskId - The ID of the task 
 * @returns {string} - The HTML string for the mark as done button
 */
export function renderMarkAsDoneButton(taskId: string): string {
    return `<button>Mark as Done</button>`;
}

/**
 * Renders a delete button
 * @param {string} taskId - The ID of the task 
 * @returns {string} - The HTML string for the delete button
 */
export function renderDeleteButton(taskId: string): string {
    return `<button>Delete</button>`;
}