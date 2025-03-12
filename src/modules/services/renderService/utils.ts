import { Member } from "../../models/members";

export function getMemberInitials(memberId: string, members: Member[]): string {
    const member = members.find(member => member.id === memberId);
    if (member) {
        const initials = member.name.split(' ').map(name => name[0]).join('');
        return initials.toUpperCase();
    }
    return '??';
}