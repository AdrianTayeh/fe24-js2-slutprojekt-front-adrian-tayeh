import { addMember, fetchMembers, fetchTasks } from "../apiService";
import { renderTasks } from "../renderService/renderIndex";
import { Member } from "../../models/members";

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

function highlightElement(element: Element | null) {
    if (element) {
        element.classList.add("highlight");
        setTimeout(() => {
            element.classList.remove("highlight");
        }, 2000);
    }
}

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