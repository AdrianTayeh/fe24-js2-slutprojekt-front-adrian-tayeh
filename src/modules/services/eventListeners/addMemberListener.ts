import { addMember, fetchMembers, fetchTasks } from "../apiService";
import { renderTasks } from "../renderService/renderIndex";
import { Member } from "../../models/members";

/**
 * Handles the addition of a new member
 */
export async function handleAddMember() {
    const name = (document.getElementById("member-input") as HTMLInputElement).value;
    const roles = Array.from(document.querySelectorAll('.add-member input[type="checkbox"]:checked') as NodeListOf<HTMLInputElement>).map((checkbox) => checkbox.value) as ("ux" | "frontend" | "backend")[];

    if (name && roles.length > 0) {
        const invalidRoles = roles.filter((role) => !["ux", "frontend", "backend"].includes(role));
        if (invalidRoles.length) {
            alert(`Invalid roles: ${invalidRoles.join(", ")}`);
            return;
        }

        const newMember = {
            name,
            roles,
        } as Partial<Member>;

        console.log("Adding new member:", newMember);

        try {
            await addMember(newMember);
            const updatedMembers = await fetchMembers();
            const updatedTasks = await fetchTasks();
            renderTasks(updatedTasks, updatedMembers);
            populateFilterMemberSelect(updatedMembers);
            highlightElement(document.querySelector(".add-member"));
        } catch (error) {
            console.error("Failed to add member:", error);
        }
    }
}

/**
 * Highlights an element by adding a CSS class and removing it after a delay
 * @param {Element | null} element - The element to highlight
 */
function highlightElement(element: Element | null) {
    if (element) {
        element.classList.add("highlight");
        setTimeout(() => {
            element.classList.remove("highlight");
        }, 2000);
    }
}

/**
 * Populates the filter member select dropdown with the list of members
 * @param {Member[]} members - The array of members
 */
function populateFilterMemberSelect(members: Member[]) {
    const filterMemberSelect = document.getElementById("filter-member");
    if (filterMemberSelect) {
        filterMemberSelect.innerHTML = '<option value="">Select Member</option>';
        members.forEach((member) => {
            const option = document.createElement("option");
            option.value = member.id;
            option.textContent = member.name;
            filterMemberSelect.appendChild(option);
        });
    }
}