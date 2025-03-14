import { fetchTasks, fetchMembers } from "../apiService";
import { renderTasks } from "../renderService/renderIndex";
import { handleAddTask } from "./addTaskListener";
import { handleAddMember } from "./addMemberListener";
import { applyFiltersAndSort } from "./filterSortListeners";
import { Task } from "../../models/tasks";
import { Member } from "../../models/members";

/**
 * Sets up event listeners for the application
 */
export async function setupEventListeners() {
    const tasks: Task[] = await fetchTasks();
    const members: Member[] = await fetchMembers();

    renderTasks(tasks, members);
    populateFilterMemberSelect(members);

    const addTaskForm = document.getElementById("add-task-form") as HTMLFormElement;
    if (addTaskForm) {
        addTaskForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleAddTask(members);
        });
    }

    const addMemberForm = document.getElementById("add-member-form") as HTMLFormElement;
    if (addMemberForm) {
        addMemberForm.addEventListener("submit", (event) => {
            event.preventDefault();
            handleAddMember();
        });
    }

    document.getElementById("filter-member")?.addEventListener("change", () => applyFiltersAndSort(members));
    document.getElementById("filter-category")?.addEventListener("change", () => applyFiltersAndSort(members));
    document.getElementById("sort-field")?.addEventListener("change", () => applyFiltersAndSort(members));
    document.getElementById("sort-order")?.addEventListener("change", () => applyFiltersAndSort(members));
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