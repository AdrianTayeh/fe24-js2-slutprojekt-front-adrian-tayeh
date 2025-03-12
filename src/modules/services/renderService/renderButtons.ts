import { Member } from "../../models/members";

export function renderAssignButton(category: 'ux' | 'frontend' | 'backend', members: Member[]): string {
    const eligibleMembers = members.filter(member => member.roles.includes(category));
    return `
        <select class="assign-member">
            <option value="">Assign to...</option>
            ${eligibleMembers.map(member => `<option value="${member.id}">${member.name}</option>`).join('')}
        </select>
    `;
}

export function renderMarkAsDoneButton(taskId: string): string {
    return `<button>Mark as Done</button>`;
}

export function renderDeleteButton(taskId: string): string {
    return `<button>Delete</button>`;
}