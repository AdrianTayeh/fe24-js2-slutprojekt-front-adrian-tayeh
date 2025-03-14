import { Member } from "../../models/members";

/**
 * Returns the initials of a member based on their ID
 * @param {string} memberId - The ID of the member
 * @param {Member[]} members - The array of all members
 * @returns {string} The initials of the member
 */
export function getMemberInitials(memberId: string, members: Member[]): string {
    const member = members.find(member => member.id === memberId);
    if (member) {
        const initials = member.name.split(' ').map(name => name[0]).join('');
        return initials.toUpperCase();
    }
    return '??';
}